class Game {
    constructor(player1, player2) {
        const colors = Math.random() > 0.5 ? [1, -1] : [-1, 1]; // Sorteia as cores
        this.player1 = { ...player1, color: colors[0] };
        this.player2 = { ...player2, color: colors[1] };
        console.log('Game initialized. Player 1:', this.player1, 'Player 2:', this.player2);
    }

    start() {
        console.log('Starting game...');
        this.player1.ws.send(JSON.stringify({ type: 'start', player: 1, color: this.player1.color }));
        this.player2.ws.send(JSON.stringify({ type: 'start', player: 2, color: this.player2.color }));
    }

    broadcast(data) {
        console.log('Broadcasting data:', data);
        this.player1.ws.send(JSON.stringify(data));
        this.player2.ws.send(JSON.stringify(data));
    }

    handleDisconnect(ws) {
        const opponent = this.player1.ws === ws ? this.player2 : this.player1;
        console.log('Player disconnected. Notifying opponent:', opponent);
        opponent.ws.send(JSON.stringify({ type: 'end', message: 'Opponent disconnected. You win!' }));
    }
}

export default Game;
