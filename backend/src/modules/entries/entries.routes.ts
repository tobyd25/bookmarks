import type { FastifyInstance } from "fastify";
import { getEntries, createEntry, putEntry } from "./entries.service.js";
import { Type, type Static } from "@sinclair/typebox";

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

export default (fastify: FastifyInstance) => {
	fastify.get("/entries", () => {
		return getEntries(fastify.db);
	});

	fastify.post("/entries", (request, reply) => {
		reply.code(201).send(createEntry(fastify.db));
	});

	fastify.put<{ Params: EntryParams; Body: PutEntry }>(
		"/entries/:id",
		(request, reply) => {
			const { id } = request.params;
			const { title, content, type, note } = request.body;

			reply.send(putEntry(fastify.db, id, title, content, type, note));
		},
	);
};
