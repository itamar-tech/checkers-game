import React from 'react';
import styles from '../styles/Square.module.css';
import Piece from './Piece';

interface SquareProps {
  isDark: boolean;
  x: number;
  y: number;
  piece: number;
  selected: boolean;
  onSelect: (x: number, y: number) => void;
}

const Square: React.FC<SquareProps> = ({ isDark, x, y, piece, selected, onSelect }) => {
  const handleClick = () => {
    onSelect(x, y);
  };

  return (
    <div
      className={`${styles.square} ${isDark ? styles.dark : styles.light} ${selected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      {piece !== 0 && <Piece isBlack={piece < 0} isKing={Math.abs(piece) === 2} />}
    </div>
  );
};

export default Square;
