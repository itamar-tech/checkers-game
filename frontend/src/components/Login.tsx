// src/components/Login.tsx
import React, { useState } from 'react';
import styles from '../styles/Login.module.css';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    if (username.trim() !== '') {
      onLogin(username);
    }
  };

  return (
    <div className={styles.login}>
      <h2>Login</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Digite seu nome"
      />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
};

export default Login;
