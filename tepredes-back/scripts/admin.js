import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const senhaAdmin = await bcrypt.hash('admin', 10)
  const admin = await prisma.admin.create({
    data: {
      nome: 'Admin',
      email: 'admin@admin.com',
      senha: senhaAdmin,
    },
  })

  console.log('Admin criado:', admin)
}

  const senhaUsuario = await bcrypt.hash('senha123', 10)
  const usuario = await prisma.usuario.create({
    data: {
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: senhaUsuario,
      status: 'ativo',
    },
  })

  console.log('Usuário criado:', usuario)

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })