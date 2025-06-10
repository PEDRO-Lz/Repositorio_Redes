import jwt from 'jsonwebtoken'
import prisma from '../prisma/prismaClient.js'

const JWT_SECRET = process.env.JWT_SECRET

const authUserOrAdmin = async (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado' })
  }
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET)

    const user = await prisma.usuario.findUnique({ where: { id: decoded.id } })
    if (user) {
      req.userId = user.id
      req.role = 'user'
      return next()
    }
    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } })
    if (admin) {
      req.adminId = admin.id
      req.role = 'admin'
      return next()
    }
    return res.status(403).json({ message: 'Apenas usuários autenticados ou administradores podem acessar' })
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' })
  }
}

export default authUserOrAdmin