const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 3000 });

const webSockets = {};

server.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'register':
        webSockets[data.peerId] = socket;
        console.log(`Peer registered: ${data.peerId}`);
        break;

      case 'message':
        const targetWebSocket = webSockets[data.targetPeerId];
        if (targetWebSocket) {
          targetWebSocket.send(JSON.stringify({ type: 'message', message: data.message }));
        } else {
          socket.send(JSON.stringify({ type: 'error', message: 'Target peer not found' }));
        }
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  });

  socket.on('close', () => {
    for (const [peerId, ws] of Object.entries(webSockets)) {
      if (ws === socket) {
        delete webSockets[peerId];
        console.log(`Peer disconnected: ${peerId}`);
        break;
      }
    }
  });
});

console.log('WebSocket signaling server is running on port 3000');