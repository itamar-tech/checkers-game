const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let waitingPlayer = null;
let activeGame = null;

const startGame = (player1, player2) => {
  const colors = Math.random() > 0.5 ? [1, -1] : [-1, 1]; // Sorteia as cores
  activeGame = { player1: { ...player1, color: colors[0] }, player2: { ...player2, color: colors[1] } };
  player1.ws.send(JSON.stringify({ type: 'start', player: 1, color: colors[0] }));
  player2.ws.send(JSON.stringify({ type: 'start', player: 2, color: colors[1] }));
};

const handleDisconnect = (ws) => {
  if (activeGame) {
    if (activeGame.player1.ws === ws || activeGame.player2.ws === ws) {
      const opponent = activeGame.player1.ws === ws ? activeGame.player2 : activeGame.player1;
      opponent.ws.send(JSON.stringify({ type: 'end', message: 'Opponent disconnected. You win!' }));
      activeGame = null;
      waitingPlayer = null;
    }
  } else if (waitingPlayer && waitingPlayer.ws === ws) {
    waitingPlayer = null;
  }
};

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log('Received message:', message);
    const data = JSON.parse(message);

    switch (data.type) {
      case 'join':
        console.log('Player joined:', data);
        if (waitingPlayer === null) {
          waitingPlayer = { id: data.id, ws, player: data.player };
          console.log('Waiting for another player...');
        } else {
          const player1 = waitingPlayer;
          const player2 = { id: data.id, ws, player: data.player };
          waitingPlayer = null;

          console.log('Starting game: Player 1:', player1, 'Player 2:', player2);
          startGame(player1, player2);
        }
        break;
      case 'move':
        console.log('Player move:', data);
        if (activeGame) {
          activeGame.player1.ws.send(JSON.stringify(data));
          activeGame.player2.ws.send(JSON.stringify(data));
        }
        break;
      default:
        console.log('Unknown message type:', data.type);
        break;
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    handleDisconnect(ws);
  });
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
