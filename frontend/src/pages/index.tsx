import React, { useState } from 'react';
import Login from '../components/Login';
import Game from '../components/Game';
import Lobby from '../components/Lobby';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inLobby, setInLobby] = useState(false);
  const [player, setPlayer] = useState<string | null>(null);

  const handleLogin = (username: string) => {
    console.log('handleLogin called with:', username);
    setPlayer(username);
    setIsLoggedIn(true);
    setInLobby(true);
  };

  const handleStartGame = () => {
    console.log('handleStartGame called');
    setInLobby(false);
  };

  console.log('Home component rendered. IsLoggedIn:', isLoggedIn, 'InLobby:', inLobby, 'Player:', player);

  return (
    <div className={styles.container}>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : inLobby ? (
        <Lobby player={player} onStartGame={handleStartGame} />
      ) : (
        <Game player={player} />
      )}
    </div>
  );
};

export default Home;
