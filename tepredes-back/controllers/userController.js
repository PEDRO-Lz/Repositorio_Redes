import { registerUserService, loginUserService, listAllUsersService, listPendingUsersService, countActivePostsService, countActiveUsersService, sendPasswordResetCodeService, resetPasswordService, verifyUserCodeService } from '../services/userService.js'
import prisma from '../prisma/prismaClient.js'
import logger from '../logger.js';
import loggerLogin from '../loggerLogin.js';
import jwt from 'jsonwebtoken';

const nomeValido = /^[A-Za-zÀ-ÿ0-9 ]+$/;

export const registerUserController = async (req, res) => {
    try {
        const { email, nome, senha } = req.body;

        if (!email || !nome || !senha) {
            return res.status(400).json({ message: 'Preencha todos os campos.' });
        }

        if (nome.length > 20 || !nomeValido.test(nome)) {
            return res.status(400).json({ message: 'Nome inválido.' });
        }

        if (email.length > 40 || !email.endsWith('@redes.ufsm.br')) {
            return res.status(400).json({ message: 'O email deve ser @redes.ufsm.br.' });
        }

        if (senha.length < 6) {
            return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
        }

        if (senha.length > 30) {
            return res.status(400).json({ message: 'A senha deve ter no máximo 30 caracteres.' });
        }

        const user = await registerUserService({ email, nome, senha });

        logger.info({
            message: "CADASTRO",
            nome,
            email,
            hostname: req.hostname,
            ip: req.headers['x-forwarded-for'] || req.ip,
            method: req.method,
            url: req.originalUrl,
        });

        res.status(201).json({ message: 'Usuário cadastrado com sucesso', user });
    } catch (err) {
        logger.error({
            message: "ERRO_CADASTRO",
            nome: req.body.nome,
            email: req.body.email,
            hostname: req.hostname,
            ip: req.headers['x-forwarded-for'] || req.ip,
            method: req.method,
            url: req.originalUrl,
            timestamp: new Date().toISOString(),
            error: err.message
        });
        res.status(500).json({ message: 'Erro no servidor', error: err.message });
    }
}

export const loginUserController = async (req, res) => {
    try {
        const { email, senha } = req.body

        if (!email || !senha) {
            return res.status(400).json({ message: 'Preencha todos os campos.' });
        }

        if (email.length > 40 || !email.endsWith('@redes.ufsm.br')) {
            return res.status(400).json({ message: 'O email deve ser @redes.ufsm.br' });
        }

        if (senha.length < 6) {
            return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
        }

        if (senha.length > 30) {
            return res.status(400).json({ message: 'A senha deve ter no máximo 30 caracteres.' });
        }

        const user = await prisma.usuario.findUnique({ where: { email } });

        if (!user || user.status !== 'ativo') {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        let token;
        try {
            token = await loginUserService({ email, senha });
        } catch {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        loggerLogin.info({
            message: "LOGIN",
            nome: user?.nome,
            email: user?.email,
            hostname: req.hostname,
            ip: req.headers['x-forwarded-for'],
            method: req.method,
            url: req.originalUrl,
            timestamp: new Date().toISOString(),
        });

        res.status(200).json({ message: 'Login realizado com sucesso', token });
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor', error: err.message });
    }
}

export const verifyUserCodeController = async (req, res) => {
    try {
        const { email, codigo } = req.body
        const user = await verifyUserCodeService(email, codigo)
        const token = jwt.sign(
            { id: user.id, nome: user.nome, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        )
        res.json({ message: 'Usuário ativado com sucesso!', token })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

export const sendPasswordResetCodeController = async (req, res) => {
    try {
        const { email } = req.body;
        await sendPasswordResetCodeService(email);
        res.json({ message: 'Código enviado para o e-mail.' });
    } catch (err) {
        if (err.message.includes("Limite diário")) {
            return res.status(429).json({ message: err.message });
        }
        res.status(400).json({ message: err.message });
    }
};

export const resetPasswordController = async (req, res) => {
    try {
        const { email, codigo, novaSenha } = req.body;
        const user = await resetPasswordService(email, codigo, novaSenha);
        const token = jwt.sign(
            { id: user.id, nome: user.nome, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );
        loggerLogin.info({
            message: 'Senha redefinida',
            nome: user.nome,
            email: user.email,
            hostname: req.hostname,
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
            timestamp: new Date().toISOString()
        });
        res.json({ message: 'Senha redefinida com sucesso!', token });
    } catch (err) {
        if (err.message.includes("Limite de tentativas")) {
            return res.status(429).json({ message: err.message });
        }
        res.status(400).json({ message: err.message });
    }
};


export const listAllUsersController = async (req, res) => {
    try {
        const users = await listAllUsersService();
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar usuários' });
    }
};

export const listPendingUsersController = async (req, res) => {
    try {
        const users = await listPendingUsersService();
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar usuários pendentes' });
    }
};

export const countActiveUsersController = async (req, res) => {
    try {
        const total = await countActiveUsersService();
        res.json({ total });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao contar usuários ativos' });
    }
};

export const countActivePostsController = async (req, res) => {
    try {
        const total = await countActivePostsService();
        res.json({ total });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao contar posts ativos' });
    }
};