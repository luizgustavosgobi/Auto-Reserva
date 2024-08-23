import { FastifyInstance } from "fastify"
import { app } from ".."

type Token = {
  prontuario: string,
}

export function verifyToken(token: string) {
  return app.jwt.verify(token) as Token
}
