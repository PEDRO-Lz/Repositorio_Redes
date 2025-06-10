import express from 'express'
import apiRoutes from './routes/apiRoutes.js'
import cors from 'cors'
import multer from 'multer'
import mongoose from 'mongoose'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT 

app.set('trust proxy', 1);

app.use(cors({
  origin: ['https://trabalhoseprovasredes.onrender.com', 'http://localhost:5173', 'http://192.168.0.66:5173'],
  credentials: true,
}));

app.use(express.json())

app.use('/api', apiRoutes)

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message === 'Apenas arquivos PDF são permitidos!') {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: 'Erro interno do servidor 0', error: err.message });
});

mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Conectado ao MongoDB')
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Erro ao conectar no MongoDB:', err)
  })