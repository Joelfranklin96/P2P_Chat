const signalingServerURL = 'ws://localhost:3000';

const signalingServer = new WebSocket(signalingServerURL);

signalingServer.onmessage = handleMessage;

function handleMessage(event) {
  const data = JSON.parse(event.data);
  switch (data.type) {
    case 'message':
      document.getElementById('messages').value += data.message + '\n';
      break;
    case 'error':
      console.error('Error:', data.message);
      break;
    default:
      console.log('Unknown message type:', data.type);
  }
}

document.getElementById('connectBtn').onclick = connect;

function connect() {
  const localPeerId = document.getElementById('localPeerId').value;
  const targetPeerId = document.getElementById('targetPeerId').value;

  if (!localPeerId || !targetPeerId) {
    alert('Please enter both your peer ID and the target peer ID.');
    return;
  }

  signalingServer.send(JSON.stringify({ type: 'register', peerId: localPeerId }));
}

document.getElementById('sendBtn').onclick = sendMessage;

function sendMessage() {
  const targetPeerId = document.getElementById('targetPeerId').value;
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;

  if (!message) {
    alert('Please enter a message to send.');
    return;
  }

  signalingServer.send(JSON.stringify({ type: 'message', targetPeerId, message }));

  document.getElementById('messages').value += 'You: ' + message + '\n';
  messageInput.value = '';
}