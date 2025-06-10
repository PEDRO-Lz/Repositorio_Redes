import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPostlist from '../../components/AdminPostlist';
import disciplinas from '../../components/disciplinas';
import '../../pages/PostsAtivos/PostsAtivos.css'; 

const POSTS_POR_PAGINA = 10;

const AdminAllPosts = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [allPosts, setAllPosts] = useState([]);
  const [error, setError] = useState('');
  const [pagina, setPagina] = useState(1);
  const [disciplinaFiltro, setDisciplinaFiltro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/posts`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
        const data = await res.json();
        if (res.ok) setAllPosts(data.posts);
        else setError(data.message);
      } catch {
        setError('Erro ao buscar todos os posts');
      }
    };
    fetchAllPosts();
  }, [API_URL]);

  const handleAtivar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/post/${id}/aprovar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ status: 'ativo' }),
      });
      const data = await res.json();
      if (res.ok) {
        setAllPosts(posts => posts.map(p => p.id === id ? { ...p, status: 'ativo' } : p));
      } else {
        setError(data.message);
      }
    } catch {
      setError('Erro ao ativar post');
    }
  };

  const handleDesativar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/post/${id}/aprovar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ status: 'pendente' }),
      });
      const data = await res.json();
      if (res.ok) {
        setAllPosts(posts => posts.map(p => p.id === id ? { ...p, status: 'pendente' } : p));
      } else {
        setError(data.message);
      }
    } catch {
      setError('Erro ao desativar post');
    }
  };

  const postsFiltrados = disciplinaFiltro
    ? allPosts.filter((post) => post.disciplina === disciplinaFiltro)
    : allPosts;

  const totalPaginas = Math.ceil(postsFiltrados.length / POSTS_POR_PAGINA);
  const postsPagina = postsFiltrados.slice(
    (pagina - 1) * POSTS_POR_PAGINA,
    pagina * POSTS_POR_PAGINA
  );

  useEffect(() => {
    setPagina(1);
  }, [disciplinaFiltro]);

return (
  <div className="posts-admin">
    <h1>Todos os Posts</h1>

    <div>
      <button onClick={() => navigate('/admin/home')}>Voltar ao painel</button>
    </div>

    <div>
      <label>
        <span>Filtrar por disciplina:</span>
        <select
          value={disciplinaFiltro}
          onChange={e => setDisciplinaFiltro(e.target.value)}
        >
          <option value="">Todas</option>
          {disciplinas.map((nome, idx) => (
            <option key={idx} value={nome}>{nome}</option>
          ))}
        </select>
      </label>
    </div>

    {error && <p>{error}</p>}

    <AdminPostlist
      posts={postsPagina}
      showActions={false}
      onAtivar={handleAtivar}
      onDesativar={handleDesativar}
    />

    {totalPaginas > 1 && (
      <div>
        <button
          onClick={() => setPagina(p => Math.max(1, p - 1))}
          disabled={pagina === 1}
        >
          Anterior
        </button>
        <span>Página {pagina} de {totalPaginas}</span>
        <button
          onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
          disabled={pagina === totalPaginas}
        >
          Próxima
        </button>
      </div>
    )}
  </div>
);

};

export default AdminAllPosts;