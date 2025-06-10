import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminUserlist from '../../components/AdminUserlist';

const USERS_POR_PAGINA = 10;

const AdminAllUsers = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState('');
  const [pagina, setPagina] = useState(1);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/usuarios`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
        const data = await res.json();
        if (res.ok) setAllUsers(data.users);
        else setError(data.message);
      } catch {
        setError('Erro ao buscar todos os usuários');
      }
    };
    fetchAllUsers();
  }, [API_URL]);

  const handleAtivar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/usuarios/${id}/aprovar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ status: 'ativo' }),
      });
      const data = await res.json();
      if (res.ok) {
        setAllUsers(users => users.map(u => u.id === id ? { ...u, status: 'ativo' } : u));
      } else {
        setError(data.message);
      }
    } catch {
      setError('Erro ao ativar usuário');
    }
  };

  const handleDesativar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/usuarios/${id}/aprovar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ status: 'pendente' }),
      });
      const data = await res.json();
      if (res.ok) {
        setAllUsers(users => users.map(u => u.id === id ? { ...u, status: 'pendente' } : u));
      } else {
        setError(data.message);
      }
    } catch {
      setError('Erro ao desativar usuário');
    }
  };

  const usersFiltrados = allUsers.filter(u => {
    const termo = filtro.toLowerCase();
    return (
      u.nome.toLowerCase().includes(termo) ||
      u.email.toLowerCase().includes(termo) ||
      String(u.id).includes(termo)
    );
  });

  const totalPaginas = Math.ceil(usersFiltrados.length / USERS_POR_PAGINA);
  const usersPagina = usersFiltrados.slice(
    (pagina - 1) * USERS_POR_PAGINA,
    pagina * USERS_POR_PAGINA
  );

  useEffect(() => {
    setPagina(1);
  }, [filtro]);

  return (
      <div className="users-admin">

    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Todos os Usuários</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <button onClick={() => navigate('/admin/home')}>Voltar ao painel</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Procurar por nome, ID ou email..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{ padding: 8, borderRadius: 8, width: 300, fontSize: 16 }}
        />
      </div>
      {error && <p>{error}</p>}
      <AdminUserlist
        users={usersPagina}
        showActions={true}
        onAtivar={handleAtivar}
        onDesativar={handleDesativar}
        paginacao={{
          pagina,
          totalPaginas,
          setPagina,
        }}
      />
    </div>
    </div>
    
  );
};

export default AdminAllUsers;