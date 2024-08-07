const WebSocket = require('ws');

const ws = new WebSocket('ws://45.137.192.184:8080');

ws.on('open', function open() {
  console.log('Connected to the server');
  
  // Simulate user joining the game
  ws.send(JSON.stringify({ type: 'join', id: 'user1', player: 'player1' }));

  // Simulate user making a move
  setTimeout(() => {
    ws.send(JSON.stringify({ type: 'move', id: 'user1', move: 'e2e4' }));
  }, 1000);

  // Simulate user disconnecting
  setTimeout(() => {
    ws.close();
  }, 2000);
});

ws.on('message', function incoming(data) {
  console.log('Received:', data);
});

ws.on('close', function close() {
  console.log('Disconnected from the server');
});
