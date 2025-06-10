import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../prisma/prismaClient.js'
import { approveOrRejectUserService } from '../services/adminService.js'
import logger from '../logger.js'

const JWT_SECRET = process.env.JWT_SECRET

export const createAdminController = async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' })
    }
    try {
        const adminExistente = await prisma.admin.findUnique({ where: { email } })
        if (adminExistente) {
            return res.status(400).json({ message: 'Já existe um admin com esse email' })
        }
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(senha, saltRounds)
        const novoAdmin = await prisma.admin.create({
            data: {
                nome,
                email,
                senha: hashedPassword,
            },
        })
        logger.info({
            message: "ADMIN CRIADO",
            nome,
            email,
            hostname: req.hostname,
            ip: req.headers['x-forwarded-for'] || req.ip,
            method: req.method,
            url: req.originalUrl,
        });
        res.status(201).json({ message: 'Admin criado com sucesso', admin: novoAdmin })
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor', error: err.message })
    }
}

export const loginAdminController = async (req, res) => {
    const { email, senha } = req.body

    if (!email || !senha) {
        logger.warn({
            message: 'ADMIN TENTATIVA de login admin sem email ou senha',
            email,
            hostname: req.hostname,
            ip: req.headers['x-forwarded-for'] || req.ip,
            method: req.method,
            url: req.originalUrl,
            timestamp: new Date().toISOString()
        });
        return res.status(400).json({ message: 'Email e senha obrigatórios' })
    }
    try {
        const admin = await prisma.admin.findUnique({ where: { email } })
        if (!admin) {
            logger.warn({
                message: 'ADMIN TENTATIVA de login com email não cadastrado',
                email,
                hostname: req.hostname,
                ip: req.headers['x-forwarded-for'] || req.ip,
                method: req.method,
                url: req.originalUrl,
                timestamp: new Date().toISOString()
            });
            return res.status(401).json({ message: 'Credenciais inválidas' })
        }
        const match = await bcrypt.compare(senha, admin.senha)
        if (!match) {
            logger.warn({
                message: 'ADMIN TENTATIVA de login com senha incorreta',
                email,
                hostname: req.hostname,
                ip: req.headers['x-forwarded-for'] || req.ip,
                method: req.method,
                url: req.originalUrl,
                timestamp: new Date().toISOString()
            });
            return res.status(401).json({ message: 'Credenciais inválidas' })
        }
        logger.info({
            message: 'ADMIN LOGIN',
            adminId: admin.id,
            email,
            hostname: req.hostname,
            ip: req.headers['x-forwarded-for'] || req.ip,
            method: req.method,
            url: req.originalUrl,
            timestamp: new Date().toISOString()
        });
        const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: '1d' })
        res.status(200).json({ message: 'Login de admin bem-sucedido', token })
    } catch (err) {
        logger.error({
            message: 'ERRO ADMIN LOGIN',
            email,
            error: err.message,
            hostname: req.hostname,
            ip: req.headers['x-forwarded-for'] || req.ip,
            method: req.method,
            url: req.originalUrl,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: 'Erro no servidor', error: err.message })
    }
}

export const approveOrRejectUserController = async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    if (status !== 'ativo' && status !== 'recusado') {
        return res.status(400).json({ message: 'Status inválido, escolha entre "ativo" ou "recusado"' })
    }
    try {
        const updatedUser = await approveOrRejectUserService(id, status)
        res.status(200).json({ message: `Usuário ${status}`, user: updatedUser })
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor', error: err.message })
    }
}

export const redefinirSenhaAdminController = async (req, res) => {
    const { id } = req.params;
    const { novaSenha } = req.body;

    if (!novaSenha) {
        return res.status(400).json({ message: 'Nova senha é obrigatória.' });
    }

    try {
        const admin = await prisma.admin.findUnique({ where: { id } });
        if (!admin) {
            return res.status(404).json({ message: 'Admin não encontrado.' });
        }

        const hashedPassword = await bcrypt.hash(novaSenha, 10);
        await prisma.admin.update({
            where: { id },
            data: { senha: hashedPassword }
        });

        logger.info({
            message: "ADMIN SENHA REDEFINIDA",
            adminId: id,
            redefinidoPor: req.user?.email || 'desconhecido',
            hostname: req.hostname,
            ip: req.headers['x-forwarded-for'] || req.ip,
            method: req.method,
            url: req.originalUrl,
            timestamp: new Date().toISOString()
        });

        res.json({ message: 'Senha redefinida com sucesso.' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao redefinir senha.', error: err.message });
    }
};