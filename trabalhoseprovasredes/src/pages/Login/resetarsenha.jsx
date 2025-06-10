import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

function ResetarSenha() {
  const location = useLocation();
  const email = location.state?.email || '';
  const codigo = location.state?.codigo || '';
  const [novaSenha, setNovaSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleResetar = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${API_URL}/resetar-senha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, codigo, novaSenha }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      alert('Senha redefinida!');
      if (data.token) localStorage.setItem('token', data.token);
      navigate('/home');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleResetar}>
        <h2>Nova senha</h2>
        <input
          placeholder="Nova senha"
          type="password"
          value={novaSenha}
          onChange={e => setNovaSenha(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Redefinindo...' : 'Redefinir'}
        </button>
      </form>
    </div>
  );
}

export default ResetarSenha;