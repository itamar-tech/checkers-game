import React, { useState } from 'react';
import PlayerSetup from '../components/PlayerSetup';
import Game from '../components/Game';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [player, setPlayer] = useState<string | null>(null);

  const handleStart = (player: string) => {
    console.log('handleStart called with:', player);
    setPlayer(player);
    setStarted(true);
  };

  console.log('Home component rendered. Started:', started, 'Player:', player, 'handleStart:', handleStart);

  return (
    <div className={styles.container}>
      <h1>Jogo de Damas</h1>
      {!started ? (
        <PlayerSetup onStart={handleStart} />
      ) : (
        <Game player={player} />
      )}
    </div>
  );
};

export default Home;
