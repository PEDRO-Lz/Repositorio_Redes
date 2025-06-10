import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login/Login.css';

const API_URL = import.meta.env.VITE_API_URL;

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/home');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erro ao fazer login');
    }
  };

  const handleUser = () => {
    navigate('/');
  };

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login Admin</h2>
        {error && <div className="login-erro">{error}</div>}
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit">Entrar</button>
        <button type="button" onClick={handleUser}>User</button>
      </form>
    </div>
  );
};

export default AdminLogin;
