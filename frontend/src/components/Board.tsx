import React from 'react';
import Piece from './Piece';
import styles from '../styles/Board.module.css';

interface BoardProps {
  board: number[][];
  selected: [number, number] | null;
  onSelect: (x: number, y: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, selected, onSelect }) => {
  return (
    <div className={styles.board}>
      {board.map((row, x) => (
        <div key={x} className={styles.row}>
          {row.map((cell, y) => (
            <div
              key={y}
              className={`${styles.cell} ${((x + y) % 2 === 0 ? styles.whiteCell : styles.blackCell)} ${selected && selected[0] === x && selected[1] === y ? styles.selected : ''}`}
              onClick={() => onSelect(x, y)}
            >
              {cell !== 0 && (
                <Piece isKing={Math.abs(cell) === 2} isBlack={cell < 0} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
