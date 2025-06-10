import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function VerificarCodigo() {
    const location = useLocation();
    const email = location.state?.email || '';
    const [codigo, setCodigo] = useState('');
    const [loading, setLoading] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const handleVerificar = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/verificar-codigo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, codigo }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Erro na verificação');
            localStorage.setItem('token', data.token);
            alert('Conta ativada!');
            navigate('/home');
        } catch (err) {
            alert('Erro: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cadastro-bg">
            <form className="cadastro-form" onSubmit={handleVerificar}>
                <h2>Verificar Código</h2>
                <input
                    placeholder="Código"
                    value={codigo}
                    onChange={e => setCodigo(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Verificando...' : 'Verificar'}
                </button>
            </form>
        </div>
    );
}

export default VerificarCodigo;