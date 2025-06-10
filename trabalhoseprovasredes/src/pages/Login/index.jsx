import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      let data = {};
      try {
        data = await res.json();
      } catch { }

      if (!res.ok) {
        setErro(data?.message || data?.error || 'Credenciais inválidas');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (err) {
      setErro('Erro no servidor. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handleCadastro = () => {
    navigate('/cadastro');
  };

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {erro && <div className="login-erro">{erro}</div>}
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Carregando...' : 'Entrar'}
        </button>
        <button type="button" onClick={handleCadastro} disabled={loading}>Cadastrar</button>
        <div className="comunidade-diretrizes">
          <span className="diretrizes-link">
            Regras da Comunidade
            <span className="diretrizes-tooltip">
              • Apenas posts de trabalhos e provas das disciplinas autorizadas pelos professores serão validados.<br />
              • Post com descrição ofensiva não será validado.<br />
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/esqueci-senha')}
          style={{ marginTop: '2px' }}
          disabled={loading}
        >
          Esqueci minha senha
        </button>
        <div className="home-footer-log">
          UFSM | CTISM | Grupo GRIPI
        </div>
        <div className="home-footer-log">
          <b>Pedro Souza</b> |
          <a href="https://github.com/PEDRO-Lz" target="_blank" rel="noopener noreferrer">GitHub</a> |
          <a href="https://www.linkedin.com/in/pedro-dev-souza/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </form>
    </div>
  );
}

export default Login;