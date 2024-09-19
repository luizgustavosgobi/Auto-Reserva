import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { verifyToken } from "../lib/verifyToken";
import { firstAccessSchema, loginSchema, tokenSchema } from "../lib/schemas";
import bcrypt from 'bcrypt'

export async function login(app: FastifyInstance) {
  app.post('/accounts/login', { schema: loginSchema }, async (req, res) => {
    const { prontuario, password } = req.body as { prontuario: string, password: string }

    const user = await prisma.user.findUnique({
      where: {
        prontuario
      }, 
      select: {
        password: true,
      }
    }).catch(() => { return res.status(500).send({ message: 'Internal Server Error' }) })

    if (!user || !bcrypt.compareSync(password, user?.password as string)) {
      return res.status(401).send({ message: 'Informações Incorretas' })
    }

    const token = app.jwt.sign({ prontuario }, {
      expiresIn: '5h',
      algorithm: 'HS512'
    })

    return res.status(200).send({ token })
  })

  app.post('/accounts/firstAccess', { schema: firstAccessSchema }, async (req, res) => {
    const { prontuario, accessCode, password } = req.body as { prontuario: string, accessCode: string, password: string }
  
    const user = await prisma.user.findUnique({
      where: {
        prontuario
      },
      select: {
        accessCode: true,
      }
    }).catch(() => { return res.status(500).send({ message: 'Internal Server Error' }) })

    if (!user) return res.status(401).send({ message: 'Usuário inexistente' })
    if (user?.accessCode !== accessCode) { return res.status(401).send({ message: 'Informações Incorretas' }) }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) { return res.status(500).send({ message: 'Internal Server Error' }) }

        await prisma.user.update({
          where: {
            prontuario
          },
          data: {
            password: hash
          }
        })
      })
    })

    return res.status(200).send({ message: 'OK' })
  })
}

export async function validateToken(app: FastifyInstance) {
  app.get('/user/validate', {schema: tokenSchema}, async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '') as string

    const user = verifyToken(token)
    return await prisma.user.findUnique({
      where: {
        prontuario: user.prontuario
      },
      select: {
        name: true,
        prontuario: true,
        photo: true,
        role: true,
        email: true,
        reciveEmails: true,
        funds: true,
        days: {
          select: {
            reserve: true,
            extraDays: true,
            deletedDays: true,
            daysOfWeek: true,
          }
        }
      }
    }).catch(() => { return res.status(500).send({ message: 'Internal Server Error' }) })
  })
}