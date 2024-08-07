import WebSocket from 'ws';

const ws1 = new WebSocket('ws://45.137.192.184:8080');
const ws2 = new WebSocket('ws://45.137.192.184:8080');

ws1.on('open', function open() {
  const id = Math.random().toString(36).substring(2);
  console.log('Player 1 WebSocket opened. Sending join message.');
  ws1.send(JSON.stringify({ type: 'join', id, player: 'player1' }));
});

ws2.on('open', function open() {
  const id = Math.random().toString(36).substring(2);
  console.log('Player 2 WebSocket opened. Sending join message.');
  ws2.send(JSON.stringify({ type: 'join', id, player: 'player2' }));
});

ws1.on('message', function incoming(data) {
  console.log('Player 1 received:', data);
});

ws2.on('message', function incoming(data) {
  console.log('Player 2 received:', data);
});
