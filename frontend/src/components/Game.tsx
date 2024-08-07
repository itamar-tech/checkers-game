import React, { useEffect, useState } from 'react';
import Board from './Board';
import styles from '../styles/Game.module.css';

const initialBoard = () => {
  const board = Array(8).fill(null).map(() => Array(8).fill(0));
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 8; j += 2) {
      board[i][(i + 1) % 2 + j] = -1; // Peças azuis no topo
      board[7 - i][i % 2 + j] = 1; // Peças vermelhas na parte inferior
    }
  }
  return board;
};

interface GameProps {
  player: string | null;
}

const Game: React.FC<GameProps> = ({ player }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [playerNumber, setPlayerNumber] = useState<number | null>(null);
  const [color, setColor] = useState<number | null>(null); // 1 for red, -1 for blue
  const [board, setBoard] = useState<number[][]>(initialBoard);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<number>(1); // 1 or 2, representing the player turn
  const [capturedPieces, setCapturedPieces] = useState<{ [key: string]: number }>({ red: 0, blue: 0 });
  const [possibleCaptures, setPossibleCaptures] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!player) return;
    const socket = new WebSocket('ws://45.137.192.184:8080'); // Use o IP da sua máquina
    socket.onopen = () => {
      const id = localStorage.getItem('playerId') || Math.random().toString(36).substring(2);
      localStorage.setItem('playerId', id);
      console.log('WebSocket opened. Sending join message with player:', player);
      socket.send(JSON.stringify({ type: 'join', id, player }));
    };
  
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Message received from server:', data);
      switch (data.type) {
        case 'start':
          console.log('Game started. Player number:', data.player, 'Color:', data.color);
          setPlayerNumber(data.player);
          setColor(data.color);
          setTurn(1); // Inicia com o turno do jogador 1
          break;
        case 'move':
          console.log('Move received:', data);
          setBoard(data.board);
          setTurn(data.turn); // Atualiza o turno com base nos dados recebidos
          if (data.captured) {
            setCapturedPieces((prev) => ({
              ...prev,
              [data.capturedColor === 1 ? 'red' : 'blue']: prev[data.capturedColor === 1 ? 'red' : 'blue'] + data.capturedCount
            }));
          }
          break;
        case 'end':
          alert(data.message);
          setBoard(initialBoard());
          setPlayerNumber(null);
          setColor(null);
          setTurn(1);
          setCapturedPieces({ red: 0, blue: 0 });
          break;
        default:
          console.log('Unknown message type:', data.type);
          break;
      }
    };
  
    setWs(socket);
  
    return () => {
      socket.close();
    };
  }, [player]);

  const getPossibleCaptures = (from: [number, number], board: number[][], piece: number) => {
    const directions = [
      [2, 2], [2, -2], [-2, 2], [-2, -2]
    ];
    const captures = [];
  
    for (const [dx, dy] of directions) {
      const to: [number, number] = [from[0] + dx, from[1] + dy];
      const midX = from[0] + dx / 2;
      const midY = from[1] + dy / 2;
  
      if (
        to[0] >= 0 && to[0] < 8 &&
        to[1] >= 0 && to[1] < 8 &&
        board[to[0]][to[1]] === 0 &&
        board[midX][midY] * piece < 0
      ) {
        captures.push(to);
      }
    }
  
    return captures;
  };

  const getKingPossibleCaptures = (from: [number, number], board: number[][], piece: number) => {
    const directions = [
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];
    const captures = [];
  
    for (const [dx, dy] of directions) {
      let step = 1;
      while (true) {
        const to: [number, number] = [from[0] + dx * step, from[1] + dy * step];
        if (to[0] < 0 || to[0] >= 8 || to[1] < 0 || to[1] >= 8) break;

        if (board[to[0]][to[1]] !== 0) break;

        const midX = from[0] + dx * (step / 2);
        const midY = from[1] + dy * (step / 2);
  
        if (board[midX][midY] * piece < 0) {
          captures.push(to);
        }

        step++;
      }
    }
  
    return captures;
  };

  const isMoveValid = (from: [number, number], to: [number, number], board: number[][], player: number): boolean => {
    const [fx, fy] = from;
    const [tx, ty] = to;

    console.log('Checking move validity from', from, 'to', to);

    if (tx < 0 || tx >= 8 || ty < 0 || ty >= 8) {
      console.log('Invalid move: destination out of bounds');
      return false; // Certifica-se de que o destino está dentro dos limites do tabuleiro
    }

    const piece = board[fx][fy];

    if (board[tx][ty] !== 0) {
      console.log('Invalid move: target cell is not empty');
      return false; // Target cell must be empty
    }
    if (piece * (color ?? 0) <= 0) {
      console.log('Invalid move: player cannot move opponent\'s piece');
      return false; // Player cannot move opponent's piece
    }

    const dx = tx - fx;
    const dy = ty - fy;

    if (Math.abs(piece) === 1) {
      if (piece === 1 && dx !== -1 && Math.abs(dx) !== 2) {
        console.log('Invalid move: player 1 can only move forwards');
        return false; // Player 1 moves forwards
      }
      if (piece === -1 && dx !== 1 && Math.abs(dx) !== 2) {
        console.log('Invalid move: player 2 can only move forwards');
        return false; // Player 2 moves forwards
      }

      if (Math.abs(dy) === 1 && Math.abs(dx) === 1) {
        return true; // Simple move
      }
      if (Math.abs(dy) === 2 && Math.abs(dx) === 2 && board[(fx + tx) / 2][(fy + ty) / 2] * piece < 0) {
        return true; // Capture move
      }
    }

    if (Math.abs(piece) === 2) {
      if (Math.abs(dx) === Math.abs(dy)) {
        let steps = Math.abs(dx);
        for (let i = 1; i < steps; i++) {
          if (board[fx + i * (dx / steps)][fy + i * (dy / steps)] !== 0) {
            return false; // Path must be clear
          }
        }
        return true; // King move
      }
    }

    console.log('Invalid move: move not allowed');
    return false;
  };

  const makeMove = (from: [number, number], to: [number, number]) => {
    if (ws && playerNumber !== null) {
      if (!isMoveValid(from, to, board, playerNumber)) {
        console.log('Invalid move from', from, 'to', to);
        setSelected(null);
        return;
      }
  
      const newBoard = board.map(row => row.slice());
      const piece = newBoard[from[0]][from[1]];
      newBoard[from[0]][from[1]] = 0;
      newBoard[to[0]][to[1]] = piece;
  
      let capturedCount = 0;
      let capturedColor = null;
  
      const dx = to[0] - from[0];
      const dy = to[1] - from[1];
      if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
        const midX = from[0] + dx / 2;
        const midY = from[1] + dy / 2;
        const capturedPiece = newBoard[midX][midY];
        if (capturedPiece !== 0) {
          capturedCount++;
          capturedColor = capturedPiece > 0 ? 1 : -1;
          newBoard[midX][midY] = 0;
        }
      }
  
      const moreCaptures = piece === 2 || piece === -2 ? getKingPossibleCaptures(to, newBoard, piece) : getPossibleCaptures(to, newBoard, piece);
  
      if (capturedCount > 0 && moreCaptures.length > 0) {
        console.log('More captures possible, continuing turn');
        setBoard(newBoard);
        setSelected(to);
        return;
      }
  
      if (to[0] === 0 && piece === 1) newBoard[to[0]][to[1]] = 2;
      if (to[0] === 7 && piece === -1) newBoard[to[0]][to[1]] = -2;
  
      setBoard(newBoard);
      setTurn(turn === 1 ? 2 : 1);
      console.log('Sending move:', { from, to, board: newBoard, player: playerNumber, turn: turn === 1 ? 2 : 1, captured: capturedCount > 0, capturedColor, capturedCount });
      ws.send(JSON.stringify({ type: 'move', from, to, board: newBoard, player: playerNumber, turn: turn === 1 ? 2 : 1, captured: capturedCount > 0, capturedColor, capturedCount, id: localStorage.getItem('playerId') }));
    }
  };

  const handleSelect = (x: number, y: number) => {
    if (playerNumber !== turn) {
      console.log('Not your turn');
      return;
    }

    console.log('Selected:', selected);
    if (selected) {
      console.log('Attempting move from', selected, 'to', [x, y]);
      makeMove(selected, [x, y]);
      setSelected(null);
    } else {
      if (board[x][y] * (color ?? 0) > 0) {
        setSelected([x, y]);
        console.log('Piece selected:', [x, y]);
        const captures = board[x][y] === 2 || board[x][y] === -2 ? getKingPossibleCaptures([x, y], board, board[x][y]) : getPossibleCaptures([x, y], board, board[x][y]);
        setPossibleCaptures(captures);
      }
    }
  };

  console.log('Game component rendered. Player:', player, 'PlayerNumber:', playerNumber, 'Turn:', turn, 'Color:', color);

  if (playerNumber === null) {
    return <div className={styles.waiting}>Aguardando outro jogador se conectar...</div>;
  }

  return (
    <div className={styles.game}>
      <div className={styles.info}>
        <p>Você é o Jogador {playerNumber} ({color === 1 ? 'Vermelho' : 'Azul'})</p>
        <p>Turno do Jogador {turn}</p>
        <p>Peças capturadas - Vermelho: {capturedPieces.red}, Azul: {capturedPieces.blue}</p>
      </div>
      <Board board={board} selected={selected} onSelect={handleSelect} possibleCaptures={possibleCaptures} />
    </div>
  );
};

export default Game;
