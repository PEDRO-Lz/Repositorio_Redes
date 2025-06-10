import { useState } from 'react';

const USERS_POR_PAGINA = 10;

const AdminUserlist = ({ users, showActions, onApprove, onReject }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [pagina, setPagina] = useState(1);

  const totalPaginas = Math.ceil(users.length / USERS_POR_PAGINA);
  const usersPagina = users.slice(
    (pagina - 1) * USERS_POR_PAGINA,
    pagina * USERS_POR_PAGINA
  );

return (
  <div className="posts-container">
    <ul className="posts-list">
      {usersPagina.map((user) => (
        <li key={user.id} className="post-card">
          <p><strong>Nome:</strong> {user.nome}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Status:</strong> {user.status}</p>

          {showActions && (
            <div className="posts-ativos-btns">
              <button onClick={() => onApprove(user.id)}>Aprovar</button>
              <button onClick={() => onReject(user.id)}>Rejeitar</button>
            </div>
          )}
        </li>
      ))}
    </ul>

    {totalPaginas > 1 && (
      <div className="paginacao">
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

export default AdminUserlist;