import { FastifyInstance } from "fastify";
import { DbClient } from "./db";

declare module "fastify" {
	interface FastifyInstance {
		db: DbClient;
	}
}
