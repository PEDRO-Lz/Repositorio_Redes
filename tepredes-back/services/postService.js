import prisma from '../prisma/prismaClient.js'

export const createPostService = async (usuarioId, arquivoPdf, tipo, disciplina, descricao) => {
  return await prisma.post.create({
    data: {
      usuarioId,
      arquivoPdf,
      tipo,
      disciplina,
      descricao,
    }
  })
}

export const approveOrRejectPostService = async (postId, status, adminId) => {
  return await prisma.post.update({
    where: { id: postId },
    data: {
      status,
      adminId
    }
  })
}

export const getAllPostsService = async () => {
  return await prisma.post.findMany({
    include: {
      postadoPor: {
        select: {
          id: true,
          nome: true,
          email: true,
          status: true
        }
      },
      adminResponsavel: {
        select: {
          id: true,
          nome: true,
          email: true
        }
      }
    }
  })
}

export const getActivePostsService = async () => {
  return await prisma.post.findMany({
    where: { status: 'ativo' },
    select: {
      id: true,
      arquivoPdf: true,
      tipo: true,
      disciplina: true,
    }
  })
}

export const getActivePostsByDisciplinaService = async (disciplina) => {
  return await prisma.post.findMany({
    where: {
      status: 'ativo',
      disciplina
    },
    select: {
      id: true,
      arquivoPdf: true,
      tipo: true,
      disciplina: true,
      descricao: true
    }
  })
}

export const getPendingPostsService = async () => {
  return await prisma.post.findMany({
    where: { status: 'pendente' },
    include: {
      postadoPor: true
    }
  })
}