import { FastifyInstance, FastifyReply } from "fastify"
import { prisma } from "../lib/prisma"
import { verifyToken } from "../lib/verifyToken"
import { createUserSchema, deleteUserSchema, editUserDataSchema, foundsSchema, tokenSchema } from "../lib/schemas"

async function isAdmin(prontuario: string, res: FastifyReply) {
  return await prisma.user.findUnique({
    where: {
      prontuario
    },
    select: {
      isAdm: true
    }
  }).catch(() => { return res.status(401).send({ message: "Internal Server Error" }) })
}

export async function admRoutes(app: FastifyInstance) {
  app.get('/users', { schema: tokenSchema }, async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '') as string

    const user = verifyToken(token)
    await isAdmin(user.prontuario, res)

    return await prisma.user.findMany({
      select: {
        prontuario: true,
        name: true,
        email: true,
        photo: true,
        isAdm: true,
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
    await isAdmin(user.prontuario, res)

    await prisma.dias.deleteMany({
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
    const { prontuario, name, photo, isAdm } = req.body as { prontuario: string, name: string, photo: string, isAdm: boolean }
    const token = req.headers.authorization?.replace('Bearer ', '') as string

    const user = verifyToken(token)
    await isAdmin(user.prontuario, res)

    const existingUser = await prisma.user.findUnique({
      where: { prontuario },
    });

    if (existingUser) {
      return res.status(400).send({ message: 'Usuário já criado' });
    }

    await prisma.user.create({
      data: {
        prontuario,
        name,
        photo,
        isAdm,
      }
    })
    await prisma.dias.create({
      data: {
        prontuario
      }
    })

    return res.status(201).send({ message: 'OK' })
  })

  app.put('/user/editUser', { schema: editUserDataSchema }, async (req, res) => {
    const { prontuario, name, photo, isAdm, accessCode } = req.body as { prontuario: string, name: string, photo: string, isAdm: boolean, accessCode: string }

    await prisma.user.update({
      where: {
        accessCode
      },
      data: {
        prontuario,
        name,
        photo,
        isAdm
      }
    }).catch((e) => { return res.status(500).send({ message: 'Internal Server Error' }) })

    return res.status(200).send({ message: 'Atualizado com Sucesso' })
  })

  app.put('/addFunds/:prontuario', { schema: foundsSchema }, async (req, res) => {
    const { prontuario } = req.params as { prontuario: string }
    const { amount } = req.body as { amount: number }
    const token = req.headers.authorization?.replace('Bearer ', '') as string

    const user = verifyToken(token)
    await isAdmin(user.prontuario, res)

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