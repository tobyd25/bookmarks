import * as fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import fp from 'fastify-plugin'
import Database from 'better-sqlite3'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const db = new Database(path.join(__dirname, '../database.db'))

export default fp((fastify) => {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), { encoding: 'utf-8' })
    db.exec('PRAGMA foreign_keys = ON')
    db.exec(schema)
    
    fastify.decorate('db', {
        get: (sql, params = []) => {
            return db.prepare(sql).get(...params)
        },
        
        all: (sql, params = []) => {
            return db.prepare(sql).all(...params)
        },
        
        run: (sql, params = []) => {
            return db.prepare(sql).run(...params)
        }
    })

    fastify.addHook("onClose", () => {
        db.close()
    })
})
