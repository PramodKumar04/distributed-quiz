const http = require('http');
const httpProxy = require('http-proxy');
const { spawn } = require('child_process');

// Configuration
const PORT = process.env.PORT || 3000;
const MAX_SERVERS = 3;
const MAX_CONNECTIONS_PER_SERVER = 5;
const START_PORT = parseInt(PORT) + 1;

let activeServers = []; // { host: '127.0.0.1', port: 300X, process: ChildProcess, active: true }
let activeConnections = 0;
let isSpawning = false;

// Create a proxy server with custom application-level logic
const proxy = httpProxy.createProxyServer({
  xfwd: true, // adds x-forwarded-for headers
});

// Simple string hashing function
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Function to spawn a new backend node
function spawnServer(port) {
  return new Promise((resolve) => {
    isSpawning = true;
    console.log(`[AutoScaler] Spawning new server on port ${port}...`);
    
    // Spawn the node process
    const child = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: port },
      stdio: 'inherit' // pipe stdout/stderr to the load balancer console
    });

    const serverObj = { host: '127.0.0.1', port, process: child, active: false };
    activeServers.push(serverObj);

    // Wait a bit for the Express server to boot and start listening
    setTimeout(() => {
      serverObj.active = true;
      isSpawning = false;
      console.log(`[AutoScaler] Server on port ${port} is now ACTIVE.`);
      resolve();
    }, 2500); // 2.5s boot delay

    child.on('exit', (code) => {
      console.log(`[AutoScaler] Server on port ${port} exited with code ${code}.`);
      activeServers = activeServers.filter(s => s.port !== port);
    });
  });
}

// Check scale up logic
function checkScale() {
  if (isSpawning) return; // Wait until current spawn finishes

  // How many servers do we ideally need?
  const needed = Math.ceil(activeConnections / MAX_CONNECTIONS_PER_SERVER);
  
  if (needed > activeServers.length && activeServers.length < MAX_SERVERS) {
    const nextPort = START_PORT + activeServers.length;
    spawnServer(nextPort);
  }
}

// Listen for the `error` event on `proxy`.
proxy.on('error', function (err, req, res) {
  console.error(`[LoadBalancer] Proxy Error: ${err.message}`);
  if (!res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
  }
  res.end(JSON.stringify({ success: false, message: 'Backend server is unreachable or down.' }));
});

const server = http.createServer((req, res) => {
  // Track connections
  activeConnections++;
  checkScale();

  res.on('finish', () => {
    activeConnections--;
  });

  // Handle custom health endpoint directly so frontend can see scaling status
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // allow CORS for frontend
    });
    return res.end(JSON.stringify({ 
      server: 'Auto-Scaling-LB', 
      activeConnections,
      activeServers: activeServers.filter(s => s.active).map(s => s.port)
    }));
  }

  const availableTargets = activeServers.filter(s => s.active);
  
  if (availableTargets.length === 0) {
    if (!res.headersSent) res.writeHead(503, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: false, message: 'Warming up backend servers... Please wait.' }));
  }

  // 1. Identify user (Sticky Sessions)
  const userIdentifier = req.headers['authorization'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  
  // 2. Hash the identifier to pick a target dynamically based on the user
  const targetIndex = hashString(userIdentifier) % availableTargets.length;
  const target = availableTargets[targetIndex];

  // Store the selected port in the request object for the proxyRes event
  req.selectedTargetPort = target.port;
  
  // 3. Forward the request to the dynamically selected backend
  proxy.web(req, res, { target: `http://${target.host}:${target.port}` });
});

// Optional: listen to proxyRes to log or inject headers
proxy.on('proxyRes', function (proxyRes, req, res) {
  // Add an X-Served-By header for debugging, utilizing the port we saved earlier
  if (req.selectedTargetPort) {
    proxyRes.headers['x-served-by'] = `backend-${req.selectedTargetPort}`;
  }
});

server.listen(PORT, async () => {
  console.log(`
================================================
   Auto-Scaling Load Balancer (User/IP Hash)
================================================
   Listening on port: ${PORT}
   Max Connections/Server: ${MAX_CONNECTIONS_PER_SERVER}
   Max Servers Limit: ${MAX_SERVERS}
================================================
`);
  // Automatically start the first backend instance immediately
  await spawnServer(START_PORT);
});

// Cleanup child processes on exit
process.on('SIGINT', () => {
  console.log('\\n[AutoScaler] Shutting down backend servers...');
  activeServers.forEach(s => s.process.kill());
  process.exit(0);
});
process.on('SIGTERM', () => {
  activeServers.forEach(s => s.process.kill());
  process.exit(0);
});
