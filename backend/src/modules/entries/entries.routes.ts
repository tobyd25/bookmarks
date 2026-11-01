import type { FastifyInstance } from "fastify";
import {
	getEntries,
	createEntry,
	putEntry,
	createEmptyEntry,
} from "./entries.service.js";
import { Type, type Static } from "@sinclair/typebox";
import { AppError } from "../../app-error.js";

interface EntryParams {
	id: number;
}

const PutEntryDto = Type.Object({
	title: Type.Optional(Type.String()),
	content: Type.Optional(Type.String()),
	type: Type.Optional(Type.Number()),
	note: Type.Optional(Type.String()),
});

type PutEntry = Static<typeof PutEntryDto>;
type CreateEntry = Static<typeof PutEntryDto>;

export default (fastify: FastifyInstance) => {
	fastify.get("/entries", () => {
		return getEntries(fastify.db);
	});

	fastify.post<{ Body: CreateEntry }>("/entries", (request, reply) => {
		if (request.body == undefined) {
			reply.code(201).send(createEmptyEntry(fastify.db));
		}
		const { title, content, type, note } = request.body;
		reply.code(201).send(createEntry(fastify.db, title, content, type, note));
	});

	fastify.put<{ Params: EntryParams; Body: PutEntry }>(
		"/entries/:id",
		(request, reply) => {
			if (request.body == undefined) {
				throw new AppError(400, "Bad Request", "BAD_REQUEST");
			}
			const { id } = request.params;
			const { title, content, type, note } = request.body;

			reply.send(putEntry(fastify.db, id, title, content, type, note));
		},
	);
};
