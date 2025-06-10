import { createPostService } from '../services/postService.js'
import { approveOrRejectPostService } from '../services/postService.js'
import { getAllPostsService, getActivePostsService, getActivePostsByDisciplinaService, getPendingPostsService } from '../services/postService.js'
import logger from '../logger.js';

import File from '../models/file.model.js';

export const createPostController = async (req, res) => {
  const userId = req.userId;
  const nome = req.user?.nome || '';
  const { tipo, disciplina, descricao } = req.body;

  if (!req.file || !tipo || !disciplina || !descricao) {
    return res.status(400).json({ message: 'Campos obrigatórios: arquivoPdf, tipo, disciplina, descricao' });
  }

  if (descricao.length > 250) {
    return res.status(400).json({ message: 'A descrição deve ter no máximo 250 caracteres.' });
  }

  const descricaoValida = /^[A-Za-zÀ-ÿ0-9 :!?+\.,()\çáãé-]+$/i;
  if (!descricaoValida.test(descricao)) {
    return res.status(400).json({ message: 'A descrição não é válida' });
  }

  try {
    const fileDoc = await File.create({
      name: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
      uploadedBy: userId
    });

    const novoPost = await createPostService(userId, fileDoc._id, tipo, disciplina, descricao);

    logger.info({
      message: 'POST',
      userId,
      nome,
      tipo,
      disciplina,
      descricao,
      arquivoPdf: fileDoc._id,
      hostname: req.hostname,
      ip: req.headers['x-forwarded-for'] || req.ip,
      method: req.method,
      url: req.originalUrl,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({ message: 'Post criado com sucesso', post: novoPost });
  } catch (err) {
    logger.error({
      message: 'Erro ao criar post',
      error: err.message,
      userId,
      nome,
      tipo,
      disciplina,
      descricao,
      hostname: req.hostname,
      ip: req.headers['x-forwarded-for'] || req.ip,
      method: req.method,
      url: req.originalUrl,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ message: 'Erro ao criar post', error: err.message });
  }
}

export const approveOrRejectPostController = async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const adminId = req.adminId

  if (!['ativo', 'recusado'].includes(status)) {
    return res.status(400).json({ message: 'Status inválido. Use "ativo" ou "recusado"' })
  }

  try {
    const updatedPost = await approveOrRejectPostService(id, status, adminId)
    res.status(200).json({ message: `Post ${status}`, post: updatedPost })
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar post', error: err.message })
  }
}

export const getAllPostsController = async (req, res) => {
  try {
    const posts = await getAllPostsService()
    res.status(200).json({ posts })
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar posts', error: err.message })
  }
}

export const getActivePostsController = async (req, res) => {
  try {
    const posts = await getActivePostsService()
    res.status(200).json({ posts })
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar posts ativos', error: err.message })
  }
}

export const getActivePostsByDisciplinaController = async (req, res) => {
  const { disciplina } = req.params

  if (!disciplina) {
    return res.status(400).json({ message: 'Disciplina é obrigatória' })
  }

  try {
    const posts = await getActivePostsByDisciplinaService(disciplina)
    res.status(200).json({ posts })
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar posts por disciplina', error: err.message })
  }
}

export const getPendingPostsController = async (req, res) => {
  try {
    const posts = await getPendingPostsService()
    res.status(200).json({ posts })
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar posts pendentes', error: err.message })
  }
}