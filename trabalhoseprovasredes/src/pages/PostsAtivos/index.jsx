import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './PostsAtivos.css';

const API_URL = import.meta.env.VITE_API_URL;
const POSTS_POR_PAGINA = 10;

const PostsAtivos = () => {
    const { disciplina } = useParams();
    const [posts, setPosts] = useState([]);
    const [erro, setErro] = useState(null);
    const [pdfUrls, setPdfUrls] = useState({});
    const [paginaTrabalhos, setPaginaTrabalhos] = useState(1);
    const [paginaProvas, setPaginaProvas] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setErro('Token não encontrado.');
            return;
        }
        fetch(`${API_URL}/posts/ativos/${disciplina}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error('Erro na requisição');
                return res.json();
            })
            .then(data => setPosts(data.posts))
            .catch(() => {
                setErro('Não autorizado ou erro ao buscar os dados.');
            });
    }, [disciplina]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchPdfUrl = async (nomeArquivo) => {
            try {
                const res = await fetch(`${API_URL}/arquivo-temp/${nomeArquivo}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error();
                const data = await res.json();
                return data.url;
            } catch {
                return null;
            }
        };
        const arquivos = posts
            .filter(post => post.arquivoPdf)
            .map(post => post.arquivoPdf.replace('uploads/', ''));
        arquivos.forEach(async (nome) => {
            if (!pdfUrls[nome]) {
                const url = await fetchPdfUrl(nome);
                if (url) setPdfUrls(prev => ({ ...prev, [nome]: url }));
            }
        });
    }, [posts]);

    if (erro) return (
        <div className="posts-ativos-bg">
            <div className="posts-ativos-container">
                <div className="posts-ativos-header-row">
                    <h2 className="posts-ativos-title">{decodeURIComponent(disciplina)}</h2>
                    <button className="posts-back-btn" onClick={() => navigate('/home')}>Voltar</button>
                </div>
                <div className="posts-ativos-cols-row">
                    <div className="posts-col">
                        <p>{erro}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const trabalhos = posts.filter(post => post.tipo?.toLowerCase() === 'trabalho');
    const provas = posts.filter(post => post.tipo?.toLowerCase() === 'prova');

    const totalPaginasTrabalhos = Math.ceil(trabalhos.length / POSTS_POR_PAGINA);
    const trabalhosPagina = trabalhos.slice(
        (paginaTrabalhos - 1) * POSTS_POR_PAGINA,
        paginaTrabalhos * POSTS_POR_PAGINA
    );

    const totalPaginasProvas = Math.ceil(provas.length / POSTS_POR_PAGINA);
    const provasPagina = provas.slice(
        (paginaProvas - 1) * POSTS_POR_PAGINA,
        paginaProvas * POSTS_POR_PAGINA
    );

    const getPdfUrl = (arquivoPdf) => {
        if (!arquivoPdf) return "";
        const nome = arquivoPdf.replace('uploads/', '');
        return pdfUrls[nome] || "";
    };

    const handleBackHome = () => {
        navigate('/home');
    };

    return (
        <div className="posts-ativos-bg">
            <div className="posts-ativos-container">
                <div className="posts-ativos-header-row">
                    <h2 className="posts-ativos-title">{decodeURIComponent(disciplina)}</h2>
                    <button className="posts-back-btn" onClick={handleBackHome}>Voltar</button>
                </div>
                <div className="posts-ativos-cols-row">
                    <div className="posts-col">
                        <h2>Trabalhos</h2>
                        {trabalhos.length === 0 && (
                            <p className="sem-posts-msg">Não há trabalhos para esta disciplina.</p>)}<ul className="posts-list">
                            {trabalhosPagina.map(post => {
                                const nomeArquivo = post.arquivoPdf?.replace('uploads/', '');
                                return (
                                    <li className="post-card" key={post.id}>
                                        <p><strong>Disciplina:</strong> {post.disciplina}</p>
                                        <p><strong>Descrição:</strong> {post.descricao}</p>
                                        {post.arquivoPdf && (
                                            <>
                                                {getPdfUrl(post.arquivoPdf) && (
                                                    <iframe
                                                        src={getPdfUrl(post.arquivoPdf) + "#page=1"}
                                                        width="100%"
                                                        height="400px"
                                                        title={`PDF Trabalho ${post.id}`}
                                                    />
                                                )}
                                                <Link
                                                    to={`/visualizar-pdf/${nomeArquivo}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Ver PDF
                                                </Link>
                                            </>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                        {totalPaginasTrabalhos > 1 && (
                            <div className="paginacao">
                                <button
                                    onClick={() => setPaginaTrabalhos(p => Math.max(1, p - 1))}
                                    disabled={paginaTrabalhos === 1}
                                >
                                    Anterior
                                </button>
                                <span>Página {paginaTrabalhos} de {totalPaginasTrabalhos}</span>
                                <button
                                    onClick={() => setPaginaTrabalhos(p => Math.min(totalPaginasTrabalhos, p + 1))}
                                    disabled={paginaTrabalhos === totalPaginasTrabalhos}
                                >
                                    Próxima
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="posts-col">
                        <h2>Provas</h2>
                        {provas.length === 0 && (
                            <p className="sem-posts-msg">Não há provas para esta disciplina.</p>)}                        <ul className="posts-list">
                            {provasPagina.map(post => {
                                const nomeArquivo = post.arquivoPdf?.replace('uploads/', '');
                                return (
                                    <li className="post-card" key={post.id}>
                                        <p><strong>Disciplina:</strong> {post.disciplina}</p>
                                        <p><strong>Descrição:</strong> {post.descricao}</p>
                                        {post.arquivoPdf && (
                                            <>
                                                {getPdfUrl(post.arquivoPdf) && (
                                                    <iframe
                                                        src={getPdfUrl(post.arquivoPdf) + "#page=1"}
                                                        width="100%"
                                                        height="400px"
                                                        title={`PDF Prova ${post.id}`}
                                                    />
                                                )}
                                                <Link
                                                    to={`/visualizar-pdf/${nomeArquivo}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Ver PDF
                                                </Link>
                                            </>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                        {totalPaginasProvas > 1 && (
                            <div className="paginacao">
                                <button
                                    onClick={() => setPaginaProvas(p => Math.max(1, p - 1))}
                                    disabled={paginaProvas === 1}
                                >
                                    Anterior
                                </button>
                                <span>Página {paginaProvas} de {totalPaginasProvas}</span>
                                <button
                                    onClick={() => setPaginaProvas(p => Math.min(totalPaginasProvas, p + 1))}
                                    disabled={paginaProvas === totalPaginasProvas}
                                >
                                    Próxima
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostsAtivos;