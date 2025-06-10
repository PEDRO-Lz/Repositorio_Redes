import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Post.css';
import disciplinas from '../../components/disciplinas';

function Post() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [tipo, setTipo] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false); // novo estado

  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/home');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!arquivo || !tipo || !disciplina) {
      setMensagem('Preencha todos os campos');
      return;
    }

    setEnviando(true);
    setMensagem('');

    const formData = new FormData();
    formData.append('tipo', tipo);
    formData.append('disciplina', disciplina);
    formData.append('descricao', descricao);
    formData.append('arquivoPdf', arquivo);

    try {
      const response = await fetch(`${API_URL}/post`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMensagem('Post enviado com sucesso! Aguarde a validação.');
        setTipo('');
        setDisciplina('');
        setDescricao('');
        setArquivo(null);
      } else {
        setMensagem(data.message || 'Erro ao enviar post');
      }
    } catch (err) {
      setMensagem('Erro na requisição');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="post-bg">
      <div className="post-container">
        <div className="post-header-row">
          <h2 className="post-title">Postar Material</h2>
        </div>
        <button className="post-back-btn" onClick={handleBackHome}>Voltar para Home</button>
        <form className="post-form" onSubmit={handleSubmit}>
          <label>Tipo:</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
            <option value="">Selecione</option>
            <option value="prova">Prova</option>
            <option value="trabalho">Trabalho</option>
          </select>

          <label>Disciplina:</label>
          <select value={disciplina} onChange={(e) => setDisciplina(e.target.value)} required>
            <option value="">Selecione a disciplina</option>
            {disciplinas.map((nome, idx) => (
              <option key={idx} value={nome}>{nome}</option>
            ))}
          </select>

          <label>Descrição (opcional):</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite uma descrição (opcional)"
          />

          <label>Arquivo PDF:</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setArquivo(e.target.files[0])}
            required
          />

          <button type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
        {mensagem && <p className="post-mensagem">{mensagem}</p>}
      </div>
    </div>
  );
}

export default Post;