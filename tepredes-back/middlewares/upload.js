import multer from 'multer';

const storage = multer.memoryStorage();

const uploadPdfOnly = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // Limite de 4MB por arquivo
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Apenas arquivos PDF são permitidos!'));
    }
    cb(null, true);
  }
});

export default uploadPdfOnly;