import { gerarTokenTemporario, validarTokenTemporario } from '../services/arquivoService.js';

import File from '../models/file.model.js';

export const buscarArquivoPorId = async (id) => {
  return await File.findById(id);
};

export const gerarLinkTemporarioController = async (req, res) => {
  const API_URL = process.env.API_URL;
  const userId = req.userId;
  const { id } = req.params;

  const arquivo = await buscarArquivoPorId(id);
  if (!arquivo) return res.status(404).json({ message: 'Arquivo não encontrado' });

  const token = gerarTokenTemporario(id, userId);
  const url = `${API_URL}/api/arquivo-download/${id}?token=${token}`;
  res.json({ url });
};

export const baixarArquivoComTokenController = async (req, res) => {
  const { id } = req.params;
  const { token } = req.query;

  if (!token) return res.status(403).json({ message: 'Token obrigatório' });

  try {
    const payload = validarTokenTemporario(token);
    if (payload.nome !== id) return res.status(403).json({ message: 'Token inválido para este arquivo' });

    const arquivo = await buscarArquivoPorId(id);
    if (!arquivo) return res.status(404).json({ message: 'Arquivo não encontrado' });

    res.contentType(arquivo.contentType);
    res.send(arquivo.data);
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};