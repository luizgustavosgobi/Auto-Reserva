import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { handleToken } from "./preHandlers";
import { userPreferencesSchema, updateUserEmailSchema } from "../lib/schemas";

export async function updateUserPreferences(app: FastifyInstance) {
    app.put('/user/preferences', { schema: userPreferencesSchema, preHandler: handleToken }, async (req, res) => {
        const { daysOfWeek, deletedDays, extraDays, reserve } = req.body as {
            daysOfWeek: string[];
            deletedDays: string[];
            extraDays: string[];
            reserve: boolean;
        };

        await prisma.days.update({
            where: {
                prontuario: req.userData?.prontuario,
            },
            data: {
                reserve,
                extraDays,
                deletedDays,
                daysOfWeek,
            },
        }).catch(() => {
            return res.status(500).send({ message: 'Internal Server Error' });
        });

        return res.status(200).send({ message: 'Atualizado com sucesso' });
    });

    app.put('/user/updateEmail', { schema: updateUserEmailSchema, preHandler: handleToken }, async (req, res) => {
        const { email, receiveEmails } = req.body as { email: string; receiveEmails: boolean };

        await prisma.user.update({
            where: {
                prontuario: req.userData?.prontuario,
            },
            data: {
                email,
                receiveEmails,
            },
        }).catch(() => {
            return res.status(500).send({ message: 'Internal Server Error' });
        });

        return res.status(200).send({ message: 'Atualizado com sucesso' });
    });
}