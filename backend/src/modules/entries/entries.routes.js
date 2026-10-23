import { getEntries } from "./entries.service.js"

export default (fastify) => {
    fastify.get('/entries', () => {
        return getEntries(fastify.db)
    })
}