import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPostlist from '../../components/AdminPostlist';
import AdminUserlist from '../../components/AdminUserlist';
import './AdminHome.css';

const AdminHome = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [userError, setUserError] = useState('');
  const [totalUsersAtivos, setTotalUsersAtivos] = useState(0);
  const [totalPostsAtivos, setTotalPostsAtivos] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchUsersPendentes();
    fetchTotalUsersAtivos();
    fetchTotalPostsAtivos();
  }, []);

  const fetchTotalUsersAtivos = async () => {
    try {
      const res = await fetch(`${API_URL}/contarUsuariosAtivos`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      const data = await res.json();
      if (res.ok) setTotalUsersAtivos(data.total);
    } catch { }
  };

  const fetchTotalPostsAtivos = async () => {
    try {
      const res = await fetch(`${API_URL}/contarPostsAtivos`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      const data = await res.json();
      if (res.ok) setTotalPostsAtivos(data.total);
    } catch { }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/postsPendentes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      const data = await res.json();
      if (res.ok) setPosts(data.posts);
      else setError(data.message);
    } catch {
      setError('Erro ao buscar posts');
    }
  };

  const fetchUsersPendentes = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/usuariosPendentes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      const data = await res.json();
      if (res.ok) setUsers(data.users);
      else setUserError(data.message);
    } catch {
      setUserError('Erro ao buscar usuários');
    }
  };

  const handleApprove = async (postId) => {
    try {
      const res = await fetch(`${API_URL}/admin/post/${postId}/aprovar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ status: 'ativo' }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchPosts();
        fetchTotalPostsAtivos();
      } else setError(data.message);
    } catch {
      setError('Erro ao aprovar o post');
    }
  };

  const handleReject = async (postId) => {
    try {
      const res = await fetch(`${API_URL}/admin/post/${postId}/aprovar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ status: 'recusado' }),
      });
      const data = await res.json();
      if (res.ok) fetchPosts();
      else setError(data.message);
    } catch {
      setError('Erro ao rejeitar o post');
    }
  };

  const handleApproveUser = async (id) => {
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
        fetchUsersPendentes();
        fetchTotalUsersAtivos();
      } else setUserError(data.message);
    } catch {
      setUserError('Erro ao aprovar usuário');
    }
  };

  const handleRejectUser = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/usuarios/${id}/aprovar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ status: 'recusado' }),
      });
      const data = await res.json();
      if (res.ok) fetchUsersPendentes();
      else setUserError(data.message);
    } catch {
      setUserError('Erro ao rejeitar usuário');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/adminlogin');
  };


  return (
    <div className="home-container-admin">
      <h2 className="home-title">Painel de Admin</h2>

      <div className="home-logout-row">
        <button onClick={handleLogout}>Sair</button>
        <button onClick={() => navigate('/admin/novo')} style={{ marginLeft: 8 }}>
          Criar novo admin
        </button>
      </div>

      <div className="home-total-row-admin">
        <span>Posts Ativos:</span>
        <b>{totalPostsAtivos}</b>
        <span>|</span>
        <span>Usuários Ativos:</span>
        <b>{totalUsersAtivos}</b>
      </div>

      {error && <p className="home-error">{error}</p>}
      {userError && <p className="home-error">{userError}</p>}

      <div className="admin-cols-row">
        <div className="admin-col">
          <h2 className="home-title">Posts Pendentes</h2>
          <AdminPostlist
            posts={posts}
            showActions={true}
            onApprove={handleApprove}
            onReject={handleReject}
          />
          <button className="home-post-btn" onClick={() => navigate('/admin/posts')}>
            Ver todos os posts
          </button>
        </div>
        <div className="admin-col">
          <h2 className="home-title">Usuários Pendentes</h2>
          <AdminUserlist
            users={users}
            showActions={true}
            onApprove={handleApproveUser}
            onReject={handleRejectUser}
          />
          <button className="home-post-btn" onClick={() => navigate('/admin/usuarios')}>
            Ver todos os usuários
          </button>
        </div>
      </div>
    </div>
  );

};

export default AdminHome;