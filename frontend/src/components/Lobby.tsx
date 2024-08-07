import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faRobot } from '@fortawesome/free-solid-svg-icons';

interface LobbyProps {
  player: string | null;
  onStartGame: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ player, onStartGame }) => {
  const [rooms, setRooms] = useState<{ id: string, players: number, maxPlayers: number }[]>([]);
  const [playerStats, setPlayerStats] = useState<{ gamesPlayed: number, wins: number, losses: number, rank: number } | null>(null);
  const [friends, setFriends] = useState<string[]>(['luiz.mauricio60']);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch initial data for rooms and player stats
    // This should be replaced with actual data fetching logic
    setRooms([
      { id: '1', players: 2, maxPlayers: 2 },
      { id: '2', players: 1, maxPlayers: 2 }
    ]);
    setPlayerStats({ gamesPlayed: 10, wins: 6, losses: 4, rank: 5 });

    // WebSocket or API call to receive messages and updates
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, newMessage]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-cover bg-bottom" style={{ backgroundImage: "url('/images/lobby-background.png')" }}>
      <header className="flex justify-between items-center p-4 bg-black bg-opacity-50">
        <div className="flex items-center space-x-2">
          <img src="/images/dama.png" alt="Dama" className="h-13 w-20"/>
          <div className="text-2xl font-bold text-white">Damas Online</div>
        </div>
        <div className="text-white text-lg flex flex-col items-end">
          <p>Usuário: {player}</p>
          <p>Partidas Jogadas: {playerStats?.gamesPlayed}</p>
          <p>Vitórias: {playerStats?.wins}</p>
        </div>
      </header>
      <div className="flex flex-1 justify-between p-4">
        <div className="flex flex-col space-y-4 w-1/4">
          <div className="bg-black bg-opacity-50 p-4 rounded h-64 overflow-y-auto">
            <h3 className="text-white mb-2 text-xl">Amigos Online</h3>
            <ul className="text-white space-y-1">
              {friends.map((friend, index) => (
                <li key={index}>{friend}</li>
              ))}
            </ul>
          </div>
          <div className="bg-black bg-opacity-50 p-4 rounded flex flex-col h-full">
            <h2 className="text-white mb-2 text-xl">Chat Geral</h2>
            <div className="flex-1 overflow-y-auto text-white space-y-1 mb-2">
              {messages.map((message, index) => (
                <p key={index}>{message}</p>
              ))}
            </div>
            <input
              type="text"
              className="p-2 rounded mb-2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem"
            />
            <button onClick={handleSendMessage} className="p-2 bg-blue-500 rounded text-white">Enviar</button>
          </div>
        </div>
        <div className="flex flex-col w-3/4 items-center justify-center">
          <div className="flex space-x-8">
            <button className="px-12 py-6 bg-green-500 rounded text-white text-2xl flex items-center space-x-2" onClick={onStartGame}>
              <FontAwesomeIcon icon={faPlay} />
              <span>JOGAR AGORA!</span>
            </button>
            <button className="px-12 py-6 bg-red-500 rounded text-white text-2xl flex items-center space-x-2">
              <FontAwesomeIcon icon={faRobot} />
              <span>Treinar com Robôs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
