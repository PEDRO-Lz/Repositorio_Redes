import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const VisualizarPdf = () => {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    fetch(`${API_URL}/arquivo-temp/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.url) throw new Error('Erro ao gerar link temporário');
        return fetch(data.url)
          .then(res => {
            if (!res.ok) throw new Error('Erro ao buscar PDF');
            return res.blob();
          });
      })
      .then(blob => setPdfUrl(URL.createObjectURL(blob)))
      .catch(() => setPdfUrl(''));
  }, [id]);

  if (!pdfUrl) return <p>Carregando PDF...</p>;

  return (
    <iframe
      src={pdfUrl}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        margin: 0,
        padding: 0,
        zIndex: 9999,
        background: '#222'
      }}
      title="Visualização do PDF"
    />
  );
};

export default VisualizarPdf;