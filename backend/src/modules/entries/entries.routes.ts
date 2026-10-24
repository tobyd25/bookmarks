import type { FastifyInstance } from "fastify";
import { getEntries, createEntry, putEntry } from "./entries.service.js";
import { Type, type Static } from "@sinclair/typebox";

interface EntryParams {
	id: number;
}

type PutEntryDto = Static<typeof PutEntrySchema>;

const PutEntrySchema = Type.Object({
	title: Type.String(),
	content: Type.String(),
	type: Type.String(),
	note: Type.String(),
});

export default (fastify: FastifyInstance) => {
	fastify.get("/entries", () => {
		return getEntries(fastify.db);
	});

	fastify.post("/entries", (request, reply) => {
		reply.code(201).send(createEntry(fastify.db));
	});

	fastify.put<{ Params: EntryParams; Body: PutEntryDto }>(
		"/entries/:id",
		{
			schema: {
				response: {
					200: PutEntrySchema,
				},
			},
		},
		(request, reply) => {
			const { id } = request.params;
			const { title, content, type, note } = request.body;

			reply.send(putEntry(fastify.db, id, title, content, type, note));
		},
	);
};
