import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

function ValidarCodigo() {
  const location = useLocation();
  const email = location.state?.email || '';
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleValidar = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/resetar-senha', { state: { email, codigo } });
    }, 500);
  };

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleValidar}>
        <h2>Digite o código</h2>
        <input
          placeholder="Código"
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Validando...' : 'Validar'}
        </button>
      </form>
    </div>
  );
}

export default ValidarCodigo;