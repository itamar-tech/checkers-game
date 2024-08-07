import React from 'react';
import Piece from './Piece';
import styles from '../styles/Board.module.css';

interface BoardProps {
  board: number[][];
  selected: [number, number] | null;
  onSelect: (x: number, y: number) => void;
  possibleCaptures: [number, number][];
}

const Board: React.FC<BoardProps> = ({ board, selected, onSelect, possibleCaptures }) => {
  return (
    <div className={styles.board}>
      {board.map((row, x) => (
        <div key={x} className={styles.row}>
          {row.map((cell, y) => {
            const isSelected = selected && selected[0] === x && selected[1] === y;
            const isCapture = possibleCaptures.some(capture => capture[0] === x && capture[1] === y);
            return (
              <div
                key={y}
                className={`${styles.cell} ${(x + y) % 2 === 0 ? styles.whiteCell : styles.blackCell} ${isSelected ? styles.selected : ''} ${isCapture ? styles.capture : ''}`}
                onClick={() => onSelect(x, y)}
              >
                {cell !== 0 && (
                  <Piece isKing={Math.abs(cell) === 2} isBlack={cell < 0} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board;
