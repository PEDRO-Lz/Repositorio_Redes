import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleEnviar = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${API_URL}/esqueci-senha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      alert('Código enviado para o email. Verifique o spam.');
      navigate('/validar-codigo', { state: { email } });
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleEnviar}>
        <h2>Esqueci minha senha</h2>
        <input
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar código'}
        </button>
      </form>
    </div>
  );
}

export default EsqueciSenha;