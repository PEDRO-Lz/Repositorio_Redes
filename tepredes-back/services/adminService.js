import prisma from '../prisma/prismaClient.js'

export const approveOrRejectUserService = async (userId, status) => {
    try {
        const updatedUser = await prisma.usuario.update({
            where: { id: userId },
            data: { status },
        })
        return updatedUser
    } catch (err) {
        throw new Error('Erro ao atualizar o status do usuário: ' + err.message)
    }
}
