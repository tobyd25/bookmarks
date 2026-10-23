import { getEntries, createEntry, putEntry } from "./entries.service.js"

export default (fastify) => {
    fastify.get('/entries', () => {
        return getEntries(fastify.db)
    })

    fastify.post('/entries', (request, reply) => {
        reply.code(201).send(createEntry(fastify.db))
    })

    fastify.put('/entries/:id', {
        body: {
            params: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    content: { type: "string" },
                    type: { type: "string" },
                    note: { type: "string" }
                }
            }
        }
    }, (request, reply) => {
        reply.send(putEntry(fastify.db, request.params.id, request.body.title, request.body.content, request.body.type, request.body.note))
    })
}