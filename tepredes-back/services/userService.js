import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../prisma/prismaClient.js'
import { sendEmail } from './mailService.js'

const JWT_SECRET = process.env.JWT_SECRET

export const registerUserService = async (userData) => {
    const { email, nome, senha } = userData
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(senha, salt)

    const codigo = Math.floor(100000 + Math.random() * 900000).toString()
    const expira = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos

    const user = await prisma.usuario.create({
        data: {
            email,
            nome,
            senha: hashedPassword,
            codigoVerificacao: codigo,
            codigoExpiraEm: expira,
        },
    })
    await sendEmail(email, 'Código de verificação', `Seu código: ${codigo}`)

    return user
}

export const sendPasswordResetCodeService = async (email) => {
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) throw new Error('Usuário não encontrado');

    const MAX_TENTATIVAS = 4;
    const JANELA_MS = 24 * 60 * 60 * 1000; // 24 horas
    const agora = new Date();

    if (user.ultimaTentativaEnvioCodigo) {
        const diff = agora.getTime() - user.ultimaTentativaEnvioCodigo.getTime();
        if (diff < JANELA_MS) {
            if ((user.tentativasEnvioCodigo || 0) >= MAX_TENTATIVAS) {
                throw new Error('Limite diário de redefinição de senha para este e-mail atingido. Tente novamente amanhã.');
            }
        } else {
            await prisma.usuario.update({
                where: { email },
                data: { tentativasEnvioCodigo: 0 }
            });
            user.tentativasEnvioCodigo = 0;
        }
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expira = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    await prisma.usuario.update({
        where: { email },
        data: {
            codigoVerificacao: codigo,
            codigoExpiraEm: expira,
            tentativasEnvioCodigo: (user.tentativasEnvioCodigo || 0) + 1,
            ultimaTentativaEnvioCodigo: agora,
        },
    });

    await sendEmail(email, 'Código para redefinir senha', `Seu código: ${codigo}`);
    return true;
};

export const resetPasswordService = async (email, codigo, novaSenha) => {
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) throw new Error('Usuário não encontrado');
    if (user.codigoVerificacao !== codigo) throw new Error('Código inválido');
    if (user.codigoExpiraEm < new Date()) throw new Error('Código expirado');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(novaSenha, salt);

    const updatedUser = await prisma.usuario.update({
        where: { email },
        data: {
            senha: hashedPassword,
            codigoVerificacao: null,
            codigoExpiraEm: null,
            tentativasEnvioCodigo: 0,
            ultimaTentativaEnvioCodigo: null,
        },
    });
    return updatedUser; 
};

export const verifyUserCodeService = async (email, codigo) => {
    const user = await prisma.usuario.findUnique({ where: { email } })
    if (!user) throw new Error('Usuário não encontrado')
    if (user.status === 'ativo') throw new Error('Usuário já ativo')
    if (user.codigoVerificacao !== codigo) throw new Error('Código inválido')
    if (user.codigoExpiraEm < new Date()) throw new Error('Código expirado')

    const updatedUser = await prisma.usuario.update({
        where: { email },
        data: {
            status: 'ativo',
            codigoVerificacao: null,
            codigoExpiraEm: null,
        },
    })
    return updatedUser
}

export const loginUserService = async (userInfo) => {
    const { email, senha } = userInfo

    const user = await prisma.usuario.findUnique({
        where: { email },
    })
    if (!user) {
        throw new Error('Usuário não encontrado')
    }
    const isMatch = await bcrypt.compare(senha, user.senha)
    if (!isMatch) {
        throw new Error('Senha inválida')
    }
    const token = jwt.sign(
        { id: user.id, nome: user.nome, email: user.email },
        JWT_SECRET,
        { expiresIn: '15m' }
    )

    return token
}

export const listAllUsersService = async () => {
    return await prisma.usuario.findMany();
};

export const listPendingUsersService = async () => {
    return await prisma.usuario.findMany({
        where: { status: 'pendente' },
    });
};

export const countActiveUsersService = async () => {
    return prisma.usuario.count({ where: { status: 'ativo' } });
};

export const countActivePostsService = async () => {
    return prisma.post.count({ where: { status: 'ativo' } });
};