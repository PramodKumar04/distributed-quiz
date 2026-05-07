const http = require('http');
const httpProxy = require('http-proxy');

// Configuration
const PORT = process.env.PORT || 3000;
const THRESHOLD = process.env.THRESHOLD || 10; // Max active connections before spilling over

// Upstream Cloud Servers
const primaryServer = { 
  name: 'Render', 
  url: process.env.RENDER_URL || 'https://distributed-quiz-backend.onrender.com' // Replace with your actual Render URL
};
const secondaryServer = { 
  name: 'Vercel', 
  url: 'https://distributed-quiz-wa4m.vercel.app'
};

let activeConnections = 0;

// Create a proxy server
const proxy = httpProxy.createProxyServer({
  changeOrigin: true, // Crucial for HTTPS targets
  secure: false       // Ignore invalid SSL certs if any
});

// Handle proxy errors
proxy.on('error', function (err, req, res) {
  console.error(`[LoadBalancer] Proxy Error: ${err.message}`);
  if (!res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
  }
  res.end(JSON.stringify({ success: false, message: 'Backend server is unreachable.' }));
});

// Create HTTP server
const server = http.createServer((req, res) => {
  // Track connections
  activeConnections++;

  res.on('finish', () => {
    activeConnections--;
  });

  // Health check endpoint
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' 
    });
    return res.end(JSON.stringify({ 
      server: 'Multi-Cloud-LB', 
      activeConnections,
      threshold: THRESHOLD
    }));
  }

  // Routing Logic: Spillover
  let target;
  if (activeConnections <= THRESHOLD) {
    target = primaryServer;
  } else {
    target = secondaryServer;
    console.log(`[LoadBalancer] THRESHOLD EXCEEDED (${activeConnections}/${THRESHOLD}). Spilling over to ${target.name}.`);
  }

  // Add custom property for proxyRes event
  req.selectedTargetName = target.name;

  // Forward request
  proxy.web(req, res, { target: target.url });
});

// Inject header into response
proxy.on('proxyRes', function (proxyRes, req, res) {
  if (req.selectedTargetName) {
    proxyRes.headers['x-served-by'] = req.selectedTargetName;
  }
});

server.listen(PORT, () => {
  console.log(`
================================================
   Multi-Cloud Load Balancer (Spillover)
================================================
   Listening on port : ${PORT}
   Connection Limit  : ${THRESHOLD}
   Primary Target    : ${primaryServer.name} (${primaryServer.url})
   Secondary Target  : ${secondaryServer.name} (${secondaryServer.url})
================================================
  `);
});
