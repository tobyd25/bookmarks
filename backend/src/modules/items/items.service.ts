import type { DbClient } from "../../types/db-client.js";

export const getItems = (db: DbClient) => {
	return db.all("SELECT * FROM items");
};

export const createEmptyItem = (db: DbClient) => {
	return db.run("INSERT INTO items DEFAULT VALUES", []);
};

export const createItem = (
	db: DbClient,
	title: string | undefined,
	content: string | undefined,
	type: number | undefined,
	note: string | undefined,
) => {
	return db.run("INSERT INTO items (title, content, type, note) VALUES (?, ?, ?, ?)", [
		title,
		content,
		type,
		note,
	]);
};

export const putItem = (
	db: DbClient,
	id: number,
	title: string | undefined,
	content: string | undefined,
	type: number | undefined,
	note: string | undefined,
) => {
	const item = db.get("SELECT * FROM items WHERE id = ?", [id]);

	if (title === undefined) title = item.title;
	if (content === undefined) content = item.content;
	if (type === undefined) type = item.type;
	if (note === undefined) note = item.note;

	return db.run("UPDATE items SET title = ?, content = ?, type = ?, note = ? WHERE id = ?", [
		title,
		content,
		type,
		note,
		id,
	]);
};
