import jwt from 'jsonwebtoken';

const SECRET_LINK_TEMP = process.env.JWT_SECRET;

export const gerarTokenTemporario = (nomeArquivo, userId) => {
  return jwt.sign(
    { nome: nomeArquivo, userId },
    SECRET_LINK_TEMP,
    { expiresIn: '5m' }
  );
};

export const validarTokenTemporario = (token) => {
  return jwt.verify(token, SECRET_LINK_TEMP);
};