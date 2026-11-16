import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fp from "fastify-plugin";
import Database from "better-sqlite3";
import type { DbClient } from "./types/db-client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbPath = process.env.DATABASE_URL || path.join(__dirname, "../database.db");
const db = new Database(dbPath);

export default fp((fastify) => {
	const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), { encoding: "utf-8" });
	db.exec("PRAGMA foreign_keys = ON");
	db.exec(schema);

	const dbClient: DbClient = {
		get: (sql: string, params = []) => {
			return db.prepare(sql).get(...params);
		},

		all: (sql: string, params = []) => {
			return db.prepare(sql).all(...params);
		},

		run: (sql: string, params = []) => {
			return db.prepare(sql).run(...params);
		},
	};

	fastify.decorate("db", dbClient);

	fastify.addHook("onClose", () => {
		db.close();
	});
});
