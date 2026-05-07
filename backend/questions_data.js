const questions = [
  {
    questionText: 'What does CAP theorem stand for?',
    options: ['Consistency, Availability, Partition Tolerance', 'Concurrency, Availability, Performance', 'Caching, Atomicity, Persistence', 'Clustering, Access, Protocol'],
    correctIndex: 0, marks: 2,
  },
  {
    questionText: 'Which load balancing algorithm assigns each request to the server with fewest active connections?',
    options: ['Round Robin', 'Weighted Round Robin', 'Least Connections', 'IP Hash'],
    correctIndex: 2, marks: 2,
  },
  {
    questionText: 'In MongoDB replica sets, which node accepts all write operations?',
    options: ['Secondary', 'Arbiter', 'Primary', 'Hidden'],
    correctIndex: 2, marks: 2,
  },
  {
    questionText: 'JWT tokens are stateless because the server:',
    options: ['Stores session in Redis', 'Stores session in MongoDB', 'Verifies the token cryptographically without a DB lookup', 'Sends session ID in a cookie'],
    correctIndex: 2, marks: 2,
  },
  {
    questionText: 'What is the purpose of the Nginx upstream block?',
    options: ['Define SSL certificates', 'Define backend server pool', 'Set rate limits', 'Configure static file serving'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'Horizontal scaling means:',
    options: ['Adding more RAM to one server', 'Adding more CPU cores to one server', 'Adding more server instances', 'Upgrading the database version'],
    correctIndex: 2, marks: 2,
  },
  {
    questionText: 'Which HTTP status code should a stateless API return when a JWT is expired?',
    options: ['400 Bad Request', '403 Forbidden', '401 Unauthorized', '500 Internal Server Error'],
    correctIndex: 2, marks: 2,
  },
  {
    questionText: 'In the CAP theorem, during a network partition, a system must choose between:',
    options: ['Consistency and Latency', 'Availability and Latency', 'Consistency and Availability', 'Durability and Partition Tolerance'],
    correctIndex: 2, marks: 2,
  },
  {
    questionText: "MongoDB's oplog is used for:",
    options: ['Logging API requests', 'Replicating operations to secondary nodes', 'Storing JWT tokens', 'Caching query results'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'Which JMeter element defines the number of concurrent virtual users?',
    options: ['HTTP Request Sampler', 'Listener', 'Thread Group', 'Assertion'],
    correctIndex: 2, marks: 2,
  },
  {
    questionText: 'What is the main advantage of using a microservices architecture?',
    options: ['Tighter coupling between components', 'Easier to deploy as a single monolithic application', 'Independent scaling and deployment of services', 'Eliminates the need for API gateways'],
    correctIndex: 2, marks: 2,
  },
  {
    questionText: 'In a distributed hash table (DHT), what is consistent hashing used for?',
    options: ['Encrypting user passwords', 'Minimizing key reassignment when nodes join or leave', 'Compressing network payloads', 'Ensuring SQL ACID properties'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'Which message broker pattern involves publishing messages to multiple subscribers simultaneously?',
    options: ['Point-to-Point', 'Publish-Subscribe', 'Request-Reply', 'MapReduce'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What does split-brain refer to in a distributed cluster?',
    options: ['A CPU executing two threads simultaneously', 'A network failure causing nodes to divide into isolated sub-clusters', 'A database shard split across two disks', 'A load balancer distributing traffic incorrectly'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What is the primary role of ZooKeeper in a distributed system?',
    options: ['Rendering frontend HTML', 'Storing massive analytical datasets', 'Providing centralized configuration and synchronization services', 'Load balancing HTTP requests'],
    correctIndex: 2, marks: 2,
  },
  {
    questionText: 'What is the primary purpose of Docker?',
    options: ['To manage virtual machines', 'To package applications into containers', 'To provide a cloud hosting service', 'To optimize database queries'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'Which of the following is a key feature of Kubernetes?',
    options: ['Automatic bin packing', 'Manual scaling', 'Fixed infrastructure', 'Monolithic architecture'],
    correctIndex: 0, marks: 2,
  },
  {
    questionText: 'What does Redis stand for?',
    options: ['Remote Dictionary Server', 'Real-time Database System', 'Reliable Data Indexing Service', 'Recursive Data Information Storage'],
    correctIndex: 0, marks: 2,
  },
  {
    questionText: 'In ACID properties, what does "Atomicity" mean?',
    options: ['All operations in a transaction succeed or none do', 'Data is consistent across all nodes', 'Transactions are executed in isolation', 'Data is stored permanently after a transaction'],
    correctIndex: 0, marks: 2,
  },
  {
    questionText: 'Which of these is a NoSQL database?',
    options: ['PostgreSQL', 'MySQL', 'MongoDB', 'Oracle'],
    correctIndex: 2, marks: 2,
  },
  {
    questionText: 'What is the "BASE" model in distributed systems?',
    options: ['Basically Available, Soft state, Eventual consistency', 'Binary Access, Secure Encryption', 'Basic Availability, Sharding, Execution', 'Backend API, Storage, Endpoints'],
    correctIndex: 0, marks: 2,
  },
  {
    questionText: 'What is the difference between REST and GraphQL?',
    options: ['REST is faster than GraphQL', 'GraphQL allows clients to request specific data fields', 'REST uses only POST requests', 'GraphQL is only for NoSQL databases'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What is OAuth 2.0 used for?',
    options: ['Database encryption', 'Authorization and delegated access', 'Load balancing', 'Network routing'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'The Raft consensus algorithm is used for:',
    options: ['Hashing passwords', 'Managing a replicated log', 'Compressing images', 'Sorting large arrays'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What is a Content Delivery Network (CDN) primarily used for?',
    options: ['Storing long-term backups', 'Serving static content from locations close to users', 'Managing user authentication', 'Performing complex server-side calculations'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What does DNS stand for?',
    options: ['Domain Name System', 'Data Network Service', 'Digital Node Storage', 'Dynamic Name Server'],
    correctIndex: 0, marks: 2,
  },
  {
    questionText: 'Serverless computing means:',
    options: ['No servers are used at all', 'The developer does not manage the server infrastructure', 'All code runs in the browser', 'Databases are not required'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'Which tool is commonly used for monitoring distributed systems?',
    options: ['Prometheus', 'Jupyter Notebook', 'Photoshop', 'VLC Media Player'],
    correctIndex: 0, marks: 2,
  },
  {
    questionText: 'What is the "ELK stack" used for?',
    options: ['Frontend development', 'Logging and log analysis', 'Database management', 'Mobile app testing'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'Apache Kafka is best described as:',
    options: ['A relational database', 'A distributed event streaming platform', 'A web server', 'A CSS framework'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What is a "Circuit Breaker" pattern used for?',
    options: ['Speeding up network requests', 'Preventing a failure in one service from cascading to others', 'Encrypting data in transit', 'Merging code branches'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What is a Service Mesh?',
    options: ['A type of physical network cable', 'An infrastructure layer for handling service-to-service communication', 'A database indexing technique', 'A project management methodology'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'Eventual consistency means:',
    options: ['Data will never be consistent', 'If no new updates are made, all accesses will eventually return the last updated value', 'Data is consistent across all nodes instantly', 'Consistency is only checked once a day'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What are Vector Clocks used for?',
    options: ['Measuring CPU temperature', 'Detecting causality and conflicts in distributed systems', 'Rendering 3D graphics', 'Optimizing network bandwidth'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'The Gossip Protocol is used for:',
    options: ['Sending newsletters to users', 'Disseminating information in a peer-to-peer network', 'Debugging frontend JavaScript', 'Managing user passwords'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What is Database Sharding?',
    options: ['Backing up a database to a separate drive', 'Horizontal partitioning of data across multiple databases', 'Adding more columns to a table', 'Deleting old records'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'Vertical scaling means:',
    options: ['Adding more servers to a cluster', 'Adding more resources (CPU, RAM) to a single server', 'Adding more tables to a database', 'Increasing the size of images'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What is the primary role of an API Gateway?',
    options: ['To store user passwords', 'To act as a single entry point for all client requests', 'To compile code', 'To provide a graphical user interface'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What does CORS stand for?',
    options: ['Cross-Origin Resource Sharing', 'Common Object Request System', 'Centralized Online Resource Storage', 'Cloud Oriented Remote Service'],
    correctIndex: 0, marks: 2,
  },
  {
    questionText: 'What is the difference between HTTP and HTTPS?',
    options: ['HTTPS is faster', 'HTTPS uses TLS/SSL for encryption', 'HTTP is only for images', 'There is no difference'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'WebSockets provide:',
    options: ['One-way communication from server to client', 'Full-duplex communication over a single TCP connection', 'A way to send emails', 'A type of database storage'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What is gRPC?',
    options: ['A new version of JavaScript', 'A high-performance Remote Procedure Call framework', 'A type of graphics card', 'A database query language'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'Idempotency in APIs means:',
    options: ['Making the same request multiple times has the same effect as making it once', 'The API is always available', 'The API returns data in JSON format', 'The API is written in Python'],
    correctIndex: 0, marks: 2,
  },
  {
    questionText: 'Rate limiting is used to:',
    options: ['Increase server speed', 'Control the number of requests a user can make in a given time', 'Compress data payloads', 'Automate code testing'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What is a Blue-Green Deployment?',
    options: ['Color-coding server racks', 'A deployment strategy that uses two identical production environments', 'Deploying code on weekends', 'A type of CSS theme'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'A Canary Release involves:',
    options: ['Testing code on a local machine', 'Rolling out a new version to a small subset of users before everyone else', 'Using birds to monitor server rooms', 'Deleting the entire database'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What is "Infrastructure as Code" (IaC)?',
    options: ['Writing code in a data center', 'Managing infrastructure through machine-readable definition files', 'Using only cloud-based IDEs', 'Building servers by hand'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What does CI/CD stand for?',
    options: ['Code Integration / Computer Design', 'Continuous Integration / Continuous Deployment', 'Centralized Intelligence / Cloud Delivery', 'Custom Interface / Core Development'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'Which of these is a principle of the "12 Factor App"?',
    options: ['Storing config in the code', 'Treating backing services as attached resources', 'Building only monolithic apps', 'Using only one programming language'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'Server Side Rendering (SSR) is beneficial for:',
    options: ['Reducing server load', 'SEO and faster initial page load', 'Removing the need for JavaScript', 'Storing data in the browser'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What is Static Site Generation (SSG)?',
    options: ['Building pages on every request', 'Generating HTML at build time', 'A way to create dynamic animations', 'A type of database indexing'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'Progressive Web Apps (PWAs) are:',
    options: ['Apps that only run on desktops', 'Web apps that use modern web capabilities to provide an app-like experience', 'Apps written in Assembly', 'A new type of operating system'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What is WebAssembly (Wasm)?',
    options: ['A new assembly language for hardware', 'A binary instruction format for a stack-based virtual machine', 'A type of web server', 'A CSS preprocessor'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'Docker Compose is used for:',
    options: ['Compiling C++ code', 'Defining and running multi-container Docker applications', 'Managing cloud budgets', 'Designing website logos'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'In Kubernetes, what is a Pod?',
    options: ['A physical server', 'The smallest deployable unit that can contain one or more containers', 'A type of network router', 'A database table'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What is a Kubernetes Service used for?',
    options: ['Monitoring CPU usage', 'Abstracting access to a set of Pods', 'Writing logs to disk', 'Managing user sessions'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'Helm is known as:',
    options: ['A security tool for Linux', 'A package manager for Kubernetes', 'A type of database shard', 'A load balancing algorithm'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What are Server-Sent Events (SSE)?',
    options: ['A way for clients to send data to servers', 'A standard allowing servers to push data to web pages over HTTP', 'An email protocol', 'A type of browser cookie'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'Which of the following is an example of an In-Memory database?',
    options: ['MySQL', 'Redis', 'Oracle', 'Cassandra'],
    correctIndex: 1, marks: 2,
  },
  {
    questionText: 'What is the purpose of a Load Balancer?',
    options: ['To distribute network traffic across multiple servers', 'To store large files', 'To encrypt database passwords', 'To compile source code'],
    correctIndex: 0, marks: 2,
  }
];

module.exports = questions;
