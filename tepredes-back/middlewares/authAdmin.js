import jwt from 'jsonwebtoken'
import prisma from '../prisma/prismaClient.js'

const JWT_SECRET = process.env.JWT_SECRET

const authAdmin = async (req, res, next) => {
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado' })
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET)
        const admin = await prisma.admin.findUnique({ where: { id: decoded.id } })

        if (!admin) {
            return res.status(403).json({ message: 'Apenas administradores podem acessar' })
        }

        req.adminId = admin.id
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' })
    }
}

export default authAdmin
