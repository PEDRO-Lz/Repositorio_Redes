import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Matriz from '../../components/Matriz';
import './Home.css';

function Home() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const [totalPosts, setTotalPosts] = useState(0);

    useEffect(() => {
        fetch(`${API_URL}/contarPostsAtivos`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then(res => res.json())
            .then(data => setTotalPosts(data.total || 0))
            .catch(() => setTotalPosts(0));
    }, [API_URL]);

    const handleSelecionarDisciplina = (disciplina) => {
        navigate(`/posts/${encodeURIComponent(disciplina)}`);
    };

    const handleIrParaPost = () => {
        navigate('/post');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="home-container">
            <div className="home-title-row">
                <img src="/UFSM_logo.png" className="home-icon" />
                <h2 className="home-title">Trabalhos e Provas Redes</h2>
                <img src="/CTISM_vertical_cor.png" className="home-icon" />
            </div>
            <div className="home-total-row">
                <span>Total de Posts:</span>
                <b>{totalPosts}</b>
            </div>
            <button className="home-post-btn" onClick={handleIrParaPost}>
                Postar Trabalho ou Prova
            </button>
            <div className="home-matrizes-row">
                <Matriz curriculoKey="2017" onSelecionarDisciplina={handleSelecionarDisciplina} />
                <Matriz curriculoKey="2025" onSelecionarDisciplina={handleSelecionarDisciplina} />
            </div>
            <div className="home-logout-row">
                <button onClick={handleLogout}>Sair</button>
            </div>
            <div className="home-footer">
                UFSM | CTISM | Grupo GRIPI
            </div>
            <div className="home-footer">
                <b>Pedro Souza</b> |
                <a href="https://github.com/PEDRO-Lz" target="_blank" rel="noopener noreferrer">GitHub</a> |
                <a href="https://www.linkedin.com/in/pedro-dev-souza/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
        </div>
    );

}

export default Home;