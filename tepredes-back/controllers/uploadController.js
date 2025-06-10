import File from '../models/file.model.js';

export const uploadFileController = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
  }

  try {
    const fileDoc = await File.create({
      name: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
      uploadedBy: req.userId
    });

    res.status(201).json({
      message: 'Arquivo enviado e salvo com sucesso!',
      fileId: fileDoc._id,
      fileName: fileDoc.name
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao salvar arquivo', error: err.message });
  }
};