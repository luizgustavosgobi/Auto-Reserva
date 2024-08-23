import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { verifyToken } from "../lib/verifyToken";
import { userPreferencesSchema, updateUserEmailSchema} from "../lib/schemas";

export async function updateUserPreferences(app: FastifyInstance) {
    app.put('/user/preferences', { schema: userPreferencesSchema }, async (req, res) => {
        const { daysOfWeek, deletedDays, extraDays, reserve } = req.body as { daysOfWeek: string[], deletedDays: string[], extraDays: string[], reserve: boolean }
        const token = req.headers.authorization?.replace('Bearer ', '') as string

        const user = verifyToken(token)

        await prisma.dias.update({
            where: {
                prontuario: user.prontuario
            },
            data: {
                reserve,
                extraDays,
                deletedDays,
                daysOfWeek
            }
        }).catch((e) => { return res.status(500).send({ message: 'Internal Server Error' }) })

        return res.status(200).send({ message: 'Atualizado com Sucesso' })
    })

    app.put('/user/updateEmail', { schema: updateUserEmailSchema}, async (req, res) => {
        const { email, reciveEmails } = req.body as { email: string, reciveEmails: boolean }
        const token = req.headers.authorization?.replace('Bearer ', '') as string

        const user = verifyToken(token)

        await prisma.user.update({
            where: {
                prontuario: user.prontuario
            },
            data: {
                email,
                reciveEmails
            }
        }).catch((e) => { return res.status(500).send({ message: 'Internal Server Error' }) })

        return res.status(200).send({ message: 'Atualizado com Sucesso' })
    })
}