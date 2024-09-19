import { prisma } from "../lib/prisma"
import { verifyToken } from "../lib/verifyToken"
import { createUserSchema, deleteUserSchema, editUserDataSchema, foundsSchema, tokenSchema } from "../lib/schemas"
import { Role } from "@prisma/client"

async function isAdmin(prontuario: string): Promise<Number | Boolean> {
  const user = await prisma.user.findUnique({
    where: {
      prontuario
    },
    select: {
      role: true
    }
  }).catch(() => { return -1 })

  return user.role == "ADMIN"
}

export async function admRoutes(app: FastifyInstance) {
  app.get('/users', { schema: tokenSchema }, async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '') as string

    const user = verifyToken(token)
    if (user == -1) return res.status(500).send({ message: "Invalid Token" })

    const isUserAdmin = await isAdmin(user.prontuario)
    if (isUserAdmin == -1) return res.status(500).send({ message: "Internal Server Error" })
    if (!isUserAdmin) return res.status(403).send({ message: "Acesso Negado" })

    return await prisma.user.findMany({
      select: {
        prontuario: true,
        name: true,
        email: true,
        photo: true,
        role: true,
        reciveEmails: true,
        accessCode: true,
      }
    })
  })

  app.delete('/user/:prontuario', { schema: deleteUserSchema }, async (req, res) => {
    const { prontuario } = req.params as { prontuario: string }
    const { accessCode } = req.body as { accessCode: string }
    const token = req.headers.authorization?.replace('Bearer ', '') as string

    const user = verifyToken(token)
    if (user == -1) return res.status(500).send({ message: "Invalid Token" })
      
    const isUserAdmin = await isAdmin(user.prontuario)
    if (isUserAdmin == -1) return res.status(500).send({ message: "Internal Server Error" })
    if (!isUserAdmin) return res.status(403).send({ message: "Acesso Negado" })

    await prisma.days.deleteMany({
      where: {
        prontuario
      }
    }).catch((e) => { return res.status(500).send({ message: "Internal Server Error" }) })

    await prisma.user.delete({
      where: {
        prontuario,
        accessCode
      }
    }).catch((e) => { return res.status(500).send({ message: "Internal Server Error" }) })

    return res.status(200).send({ message: 'OK' })
  })

  app.post('/user', { schema: createUserSchema }, async (req, res) => {
    const { prontuario, name, photo, role } = req.body as { prontuario: string, name: string, photo: string, role: string }
    const token = req.headers.authorization?.replace('Bearer ', '') as string

    const user = verifyToken(token)
    if (user == -1) return res.status(500).send({ message: "Invalid Token" })
      
    const isUserAdmin = await isAdmin(user.prontuario)
    if (isUserAdmin == -1) return res.status(500).send({ message: "Internal Server Error" })
    if (!isUserAdmin) return res.status(403).send({ message: "Acesso Negado" })

    if (await prisma.user.findUnique({ where: { prontuario } })) {
      return res.status(400).send({ message: 'Usuário já existe' });
    }

    if (!Object.values(Role).includes(role as Role)) return res.status(400).send({message: "Role inválida"})

    await prisma.user.create({
      data: {
        prontuario,
        name,
        photo,
        role: role as Role
      }
    })
    await prisma.days.create({
      data: {
        prontuario
      }
    })

    return res.status(201).send({ message: 'OK' })
  })

  app.put('/user/editUser', { schema: editUserDataSchema }, async (req, res) => {
    const { prontuario, name, photo, role, accessCode } = req.body as { prontuario: string, name: string, photo: string, role: string, accessCode: string }
    const token = req.headers.authorization?.replace('Bearer ', '') as string

    const user = verifyToken(token)
    if (user == -1) return res.status(500).send({ message: "Invalid Token" })
      
    const isUserAdmin = await isAdmin(user.prontuario)
    if (isUserAdmin == -1) return res.status(500).send({ message: "Internal Server Error" })
    if (!isUserAdmin) return res.status(403).send({ message: "Acesso Negado" })

    if (!Object.values(Role).includes(role as Role)) return res.status(400).send({message: "Role inválida"})

    await prisma.user.update({
      where: {
        accessCode
      },
      data: {
        prontuario,
        name,
        photo,
        role: role as Role
      }
    }).catch((e) => { return res.status(500).send({ message: 'Internal Server Error' }) })

    return res.status(200).send({ message: 'Atualizado com Sucesso' })
  })

  app.put('/addFunds/:prontuario', { schema: foundsSchema }, async (req, res) => {
    const { prontuario } = req.params as { prontuario: string }
    const { amount } = req.body as { amount: number }
    const token = req.headers.authorization?.replace('Bearer ', '') as string

    const user = verifyToken(token)
    if (user == -1) return res.status(500).send({ message: "Invalid Token" })
      
    const isUserAdmin = await isAdmin(user.prontuario)
    if (isUserAdmin == -1) return res.status(500).send({ message: "Internal Server Error" })
    if (!isUserAdmin) return res.status(403).send({ message: "Acesso Negado" })

    const currentFunds = await prisma.user.findUnique({
      where: {
        prontuario
      },
      select: {
        funds: true
      }
    })

    let newFunds
    if (currentFunds !== null)
      newFunds = currentFunds?.funds + amount
    else
      newFunds = 0

    await prisma.user.update({
      where: {
        prontuario
      },
      data: {
        funds: newFunds
      }
    })

    return res.status(200).send({ message: 'Atualizado com Sucesso' })
  })
}