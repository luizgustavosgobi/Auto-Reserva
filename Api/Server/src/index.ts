import fastify from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import 'dotenv/config'

import { login, validateToken } from './routes/accounts';
import {updateUserPreferences} from "./routes/updateUserPreferences";
import { admRoutes } from './routes/admRoutes';

export const app = fastify({
    ajv: {
        plugins: [
            [require('ajv-formats'), { mode: 'fast' }],
            require('ajv-errors')
        ],
        customOptions: {
            allErrors: true
        },
    }
})

app.register(jwt, {
    secret: process.env.JWT_SECRET as string
})

app.register(cors, {
    origin: '*',
    credentials: true
})

app.register(updateUserPreferences)
app.register(login)
app.register(validateToken)
app.register(admRoutes)

//

app.setErrorHandler(function (error, request, reply) {
    if (error.validation) {
        var message = 'Houve um erro com sua solicitação.'

        switch (error.validation[0].keyword) {
            case 'additionalProperties':
                var message = `O campo ${error.validation[0].params.additionalProperty} não é permitido.`
                break
            case 'errorMessage':
                message = error.validation[0].message as string
                break
            case 'required':
                message = `O campo ${error.validation[0].params.missingProperty} é obrigatório.`
                break
            case 'pattern':
                message = `O campo ${error.validation[0].params.missingProperty} não está no formato correto.`
                break
            case 'minLength':
                message = `O campo ${error.validation[0].params.missingProperty} é muito curto.`
                break
            case 'maxLength':
                message = `O campo ${error.validation[0].params.missingProperty} é muito longo.`
                break
        }
        reply.status(400).send({ message })
    }
})

app.listen({
    host: process.env.HOST ? process.env.HOST : '127.0.0.1',
    port: process.env.PORT ? Number(process.env.PORT) : 3000
}, 
(err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})