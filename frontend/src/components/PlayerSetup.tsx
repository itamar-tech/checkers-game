import React, { useState, useEffect } from 'react';

interface PlayerSetupProps {
  onStart: (player: string) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onStart }) => {
  const [player, setPlayer] = useState<string>('');
  const [waiting, setWaiting] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(30);

  const handlePlay = () => {
    if (player) {
      console.log('handlePlay called. Player:', player, 'onStart:', onStart);
      onStart(player);
      setWaiting(true);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (waiting && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [waiting, countdown]);

  console.log('PlayerSetup component rendered. onStart:', onStart);

  return (
    <div className="player-setup">
      {!waiting ? (
        <div>
          <input
            type="text"
            placeholder="Nome do Jogador"
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
          />
          <button onClick={handlePlay}>Estou pronto</button>
        </div>
      ) : (
        <div>
          <p>Aguardando outro jogador se conectar...</p>
          <p>Tempo restante: {countdown} segundos</p>
        </div>
      )}
    </div>
  );
};

export default PlayerSetup;
