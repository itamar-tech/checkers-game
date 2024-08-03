import React from 'react';
import styles from '../styles/Piece.module.css';

interface PieceProps {
  isKing: boolean;
  isBlack: boolean;
}

const Piece: React.FC<PieceProps> = ({ isKing, isBlack }) => {
  return (
    <div className={`${styles.piece} ${isBlack ? styles.black : styles.red}`}>
      {isKing && <span className={styles.king}>♛</span>}
    </div>
  );
};

export default Piece;
