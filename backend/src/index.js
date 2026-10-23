import Fastify from 'fastify'
import { AppError } from './app-error.js'

const fastify = Fastify({ logger: true })

fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
        if (error.statusCode >= 400 && error.statusCode < 500) {
            request.log.warn({
                err: error
            })
        } else {
            request.log.error({
                err: error
            })
        }

        return reply.status(error.statusCode).send({
            error: error.name,
            message: error.message,
            code: error.errorCode
        })
    } else if (error.validation) {
        request.log.error({
            err: error
        })

        return reply.status(400).send({
            error: 'Bad Request'
        })
    }

    request.log.error(error)

    reply.status(500).send({
        error: 'Internal Server Error',
        message: 'An unexpected error occured'
    })
})

fastify.register(import('./database.js'))

fastify.register(import('./modules/entries/entries.routes.js'))

fastify.listen({ port: process.env.PORT || 3000, host: process.env.HOST || "127.0.0.1"}, (err, address) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`Listening on ${address}`)
})

const shutdown = async (signal) => {
    fastify.log.info(`Received ${signal}, shutting down gracefully...`)
    await fastify.close()
    process.exit(0)
}

process.on("SIGTERM", () => shutdown("SIGTERM"))
process.on("SIGINT", () => shutdown("SIGINT"))