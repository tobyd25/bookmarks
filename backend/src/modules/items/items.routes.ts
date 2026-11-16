import type { FastifyInstance } from "fastify";
import { getItems, createItem, putItem, createEmptyItem, deleteItem } from "./items.service.js";
import { Type, type Static } from "@sinclair/typebox";
import { AppError } from "../../app-error.js";

interface ItemParams {
	id: number;
}

const PutItemDto = Type.Object({
	title: Type.Optional(Type.String()),
	content: Type.Optional(Type.String()),
	type: Type.Optional(Type.Number()),
	note: Type.Optional(Type.String()),
});

type PutItem = Static<typeof PutItemDto>;
type CreateItem = Static<typeof PutItemDto>;

export default (fastify: FastifyInstance) => {
	fastify.get("/items", () => {
		return getItems(fastify.db);
	});

	fastify.post<{ Body: CreateItem }>("/items", (request, reply) => {
		if (request.body == undefined) {
			reply.code(201).send(createEmptyItem(fastify.db));
		}
		const { title, content, type, note } = request.body;
		reply.code(201).send(createItem(fastify.db, title, content, type, note));
	});

	fastify.put<{ Params: ItemParams; Body: PutItem }>("/items/:id", (request, reply) => {
		if (request.body == undefined) {
			throw new AppError(400, "Bad Request", "BAD_REQUEST");
		}
		const { id } = request.params;
		const { title, content, type, note } = request.body;

		reply.send(putItem(fastify.db, id, title, content, type, note));
	});

	fastify.delete<{ Params: ItemParams }>("/items/:id", (request, reply) => {
		const { id } = request.params;
		reply.code(204).send(deleteItem(fastify.db, id));
	});
};
