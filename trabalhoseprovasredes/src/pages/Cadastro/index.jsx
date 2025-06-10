import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cadastro.css';

function Cadastro() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Erro no cadastro');

      alert('Código enviado para o email. Verifique o spam.');
      navigate('/verificar-codigo', { state: { email } });
    } catch (err) {
      alert('Erro ao cadastrar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/');
  };

  return (
    <div className="cadastro-bg">
      <form className="cadastro-form" onSubmit={handleCadastro}>
        <h2>Cadastre-se com o email @redes</h2>
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
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
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando e-mail...' : 'Cadastrar'}
        </button>
        <button type="button" onClick={handleLogin} disabled={loading}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Cadastro;