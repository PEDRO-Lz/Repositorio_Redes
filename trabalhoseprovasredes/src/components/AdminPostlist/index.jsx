import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../pages/PostsAtivos/PostsAtivos.css'; 

const POSTS_POR_PAGINA = 10;

const AdminPostlist = ({ posts, showActions, onApprove, onReject, onAtivar, onDesativar }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [pdfUrls, setPdfUrls] = useState({});
  const [pagina, setPagina] = useState(1);
  const navigate = useNavigate();

  const fetchPdfUrl = async (nomeArquivo) => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) return null;
    try {
      const res = await fetch(`${API_URL}/arquivo-temp/${nomeArquivo}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (!res.ok) throw new Error('Erro ao obter link temporário');
      const data = await res.json();
      setPdfUrls(prev => ({ ...prev, [nomeArquivo]: data.url }));
      return data.url;
    } catch {
      return null;
    }
  };

  const handleVerPdf = async (nomeArquivo) => {
    let url = pdfUrls[nomeArquivo];
    if (!url) {
      url = await fetchPdfUrl(nomeArquivo);
    }
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('Erro ao abrir o arquivo');
    }
  };

  const totalPaginas = Math.ceil(posts.length / POSTS_POR_PAGINA);
  const postsPagina = posts.slice(
    (pagina - 1) * POSTS_POR_PAGINA,
    pagina * POSTS_POR_PAGINA
  );

  return (
    <div className="posts-container">
      <ul className="posts-list">
        {postsPagina.map((post) => {
          const nomeArquivo = post.arquivoPdf?.replace('uploads/', '');
          const url = nomeArquivo ? pdfUrls[nomeArquivo] : '';
          return (
            <li key={post.id} className="post-card">
              <p>
                <strong>ID:</strong> {post.id}
              </p>
              <p>
                <strong>Disciplina:</strong> {post.disciplina} - <strong>Tipo:</strong> {post.tipo}
              </p>
              <p>
                <strong>Postado por:</strong> {post.postadoPor.nome} ({post.postadoPor.email})
              </p>
              <p>
                <strong>Status:</strong> {post.status}
              </p>
              <p>
                <strong>Descrição:</strong> {post.descricao}
              </p>

              {nomeArquivo && (
                <>
                  <iframe
                    src={url ? `${url}#page=1` : ''}
                    title="Prévia do PDF"
                    onLoad={async () => {
                      if (!url) await fetchPdfUrl(nomeArquivo);
                    }}
                  />
                  <button
                    className="home-post-btn"
                    style={{ margin: '12px 0 0 0', width: 'fit-content' }}
                    onClick={() => navigate(`/visualizar-pdf/${nomeArquivo}`)}
                  >
                    Ver PDF
                  </button>
                </>
              )}

              {showActions && (
                <div className="posts-ativos-btns">
                  <button onClick={() => onApprove(post.id)}>Aprovar</button>
                  <button onClick={() => onReject(post.id)}>Rejeitar</button>
                </div>
              )}
              {!showActions && onAtivar && onDesativar && (
                <div className="posts-ativos-btns">
                  {post.status === 'ativo' ? (
                    <button onClick={() => onDesativar(post.id)}>Desativar</button>
                  ) : (
                    <button onClick={() => onAtivar(post.id)}>Ativar</button>
                  )}
                </div>
              )}
            </li>
          );
        })}
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

export default AdminPostlist;