import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminNovo.css';

const API_URL = import.meta.env.VITE_API_URL;

const AdminNovo = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch(`${API_URL}/admin/criar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        body: JSON.stringify({ nome, email, senha }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Admin criado com sucesso!');
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        setMsg(data.message || 'Erro ao criar admin');
      }
    } catch {
      setMsg('Erro ao criar admin');
    }
  };


return (
  <div className="admin-novo-container">
    <h2 className="admin-novo-title">Criar novo admin</h2>
    <form className="admin-novo-form" onSubmit={handleSubmit}>
      <input
        className="admin-novo-input"
        placeholder="Nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
        required
      />
      <input
        className="admin-novo-input"
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className="admin-novo-input"
        placeholder="Senha"
        type="password"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        required
      />
      <button className="admin-novo-btn" type="submit">Criar</button>
    </form>
    {msg && <p className="admin-novo-msg">{msg}</p>}
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
      <button className="admin-novo-btn" onClick={() => navigate('/admin/home')}>Voltar</button>
    </div>
  </div>
);
};

export default AdminNovo;