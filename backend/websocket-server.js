import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import { trace } from '@opentelemetry/api';
import Game from './game.js'; // Importar o módulo de jogo
import { initializeTracing } from './tracing.js';
import express from 'express';

// Função principal para encapsular a lógica assíncrona
async function main() {
    // Inicializar o tracing
    await initializeTracing();

    const app = express();
    const server = http.createServer(app);
    const wss = new WebSocketServer({ server });

    let waitingPlayer = null;
    let activeGames = [];

    wss.on('connection', (ws) => {
        const tracer = trace.getTracer('checkers-game');
        const connectionSpan = tracer.startSpan('ws.connection');
        connectionSpan.addEvent('New client connected');
        connectionSpan.end();

        ws.on('message', (message) => {
            const messageSpan = tracer.startSpan('ws.message');
            messageSpan.addEvent('Received message', { message });

            let data;
            try {
                data = JSON.parse(message);
            } catch (error) {
                console.error('Invalid message format', error);
                messageSpan.setAttribute('error', true);
                messageSpan.end();
                return;
            }

            console.log('Received message type:', data.type);

            switch (data.type) {
                case 'join':
                    const joinSpan = tracer.startSpan('ws.join', {
                        parent: messageSpan
                    });
                    console.log('Player joined:', data);
                    if (waitingPlayer === null) {
                        waitingPlayer = { id: data.id, ws, player: data.player };
                        console.log('Waiting for another player...');
                    } else {
                        const player1 = waitingPlayer;
                        const player2 = { id: data.id, ws, player: data.player };
                        waitingPlayer = null;

                        const newGame = new Game(player1, player2);
                        activeGames.push(newGame);
                        console.log('Starting game: Player 1:', player1, 'Player 2:', player2);
                        newGame.start();
                    }
                    joinSpan.end();
                    break;
                case 'move':
                    const moveSpan = tracer.startSpan('ws.move', {
                        parent: messageSpan
                    });
                    console.log('Player move:', data);
                    const game = activeGames.find(g => g.player1.ws === ws || g.player2.ws === ws);
                    if (game) {
                        game.broadcast(data);
                    }
                    moveSpan.end();
                    break;
                default:
                    console.log('Unknown message type:', data.type);
                    break;
            }
            messageSpan.end();
        });

        ws.on('close', () => {
            const closeSpan = tracer.startSpan('ws.close');
            closeSpan.addEvent('Client disconnected');
            const gameIndex = activeGames.findIndex(g => g.player1.ws === ws || g.player2.ws === ws);
            if (gameIndex !== -1) {
                const game = activeGames[gameIndex];
                game.handleDisconnect(ws);
                activeGames.splice(gameIndex, 1);
            } else if (waitingPlayer && waitingPlayer.ws === ws) {
                waitingPlayer = null;
            }
            closeSpan.end();
        });
    });

    const address = await server.listen({ port: 8080, host: '0.0.0.0' });
    console.log(`Server is running on ${address}`);
}

main().catch(err => {
    console.error('Error starting the application', err);
    process.exit(1);
});
