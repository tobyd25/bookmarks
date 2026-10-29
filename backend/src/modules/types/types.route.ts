import type { FastifyInstance } from "fastify";

export default (fastify: FastifyInstance) => {
	fastify.get("/types", () => {
		return [
			{
				id: 1,
				name: "link",
			},
			{
				id: 2,
				name: "text",
			},
		];
	});
};
