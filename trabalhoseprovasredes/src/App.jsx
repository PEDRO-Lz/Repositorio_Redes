import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin/AdminLogin.jsx';
import AdminHome from './pages/AdminHome';
import PostsAtivos from './pages/PostsAtivos';
import Post from './pages/Post';
import AdminAllPosts from './pages/AdminTodosPosts';
import AdminAllUsers from './pages/AdminTodosUsers';
import VerificarCodigo from './pages/Cadastro/verificar-codigo';
import EsqueciSenha from './pages/Login/esquecisenha';
import ResetarSenha from './pages/Login/resetarsenha';
import ValidarCodigo from './pages/Login/validarcodigo';
import VisualizarPdf from './pages/VerPDF';
import AdminNovo from './pages/AdminNovo';
import NotFound from './pages/NotFound';

function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminPrivateRoute({ children }) {
  const isAdminAuthenticated = localStorage.getItem('adminToken');
  return isAdminAuthenticated ? children : <Navigate to="/admin/login" />;
}

function UserOrAdminPrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token') || localStorage.getItem('adminToken');
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/validar-codigo" element={<ValidarCodigo />} />
        <Route path="/resetar-senha" element={<ResetarSenha />} />
        <Route path="/home" element={<PrivateRoute> <Home /> </PrivateRoute>} />
        <Route path="/post" element={<PrivateRoute> <Post /> </PrivateRoute>} />
        <Route path="/posts/:disciplina" element={<PrivateRoute> <PostsAtivos /></PrivateRoute>} />
        <Route path="/visualizar-pdf/:id" element={<UserOrAdminPrivateRoute><VisualizarPdf /></UserOrAdminPrivateRoute>} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admin/home" element={<AdminPrivateRoute> <AdminHome /> </AdminPrivateRoute>} />
        <Route path="/admin/novo" element={<AdminPrivateRoute> <AdminNovo /> </AdminPrivateRoute>} />
        <Route path="/admin/posts" element={<AdminAllPosts />} />
        <Route path="/admin/usuarios" element={<AdminAllUsers />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App