// server.js
const WebSocket = require('ws'); // Import ws library

// Create a WebSocket server that listens on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// When a client connects to the server
wss.on('connection', function connection(ws) {
  console.log('A client connected');

  // When a message is received from the client
  ws.on('message', function incoming(message) {
    console.log('Received:', message);

    // Send a response back to the client
    ws.send(`${message}`);
  });

  // When the client disconnects
  ws.on('close', () => {
    console.log('A client disconnected');
  });
});

console.log('WebSocket server running at ws://localhost:8080');
