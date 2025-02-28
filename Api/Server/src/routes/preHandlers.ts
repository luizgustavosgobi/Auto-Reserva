import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "../lib/verifyToken";
import { prisma } from "../lib/prisma";

declare module "fastify" {
    interface FastifyRequest {
        userData?: { prontuario: string };
    }
}

export async function handleToken(req: FastifyRequest, reply: FastifyReply) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        reply.status(401).send({ message: "Token não fornecido" });
        return null;
    }

    const user = verifyToken(token);
    if (user === -1) {
        reply.status(401).send({ message: "Token inválido" });
        return null;
    }

    req.userData = user;
}

async function isAdmin(prontuario: string): Promise<boolean> {
    try {
        const user = await prisma.user.findUnique({
            where: { prontuario },
            select: { role: true }
        });

        return user?.role === "ADMIN";
    } catch (error) {
        return false;
    }
}

export async function handleTokenAndValidationAdmin(req: FastifyRequest, reply: FastifyReply ) {
    const user = await handleToken(req, reply);
    if (!user || !req.userData) return null;

    try {
        const isUserAdmin = await isAdmin(req.userData.prontuario);

        if (!isUserAdmin) {
            reply.status(403).send({ message: "Acesso Negado" });
            return;
        }

        return user;
    } catch (error) {
        reply.status(500).send({ message: "Internal Server Error" });
        return null;
    }
}