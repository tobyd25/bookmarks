import type { DbClient } from "../../types/db-client.js";

export const getEntries = (db: DbClient) => {
	return db.all("SELECT * FROM entries");
};

export const createEntry = (db: DbClient) => {
	return db.run("INSERT INTO entries DEFAULT VALUES");
};

export const putEntry = (
	db: DbClient,
	id: number,
	title: string | undefined,
	content: string | undefined,
	type: string | undefined,
	note: string | undefined,
) => {
	const entry = db.get("SELECT * FROM entries WHERE id = ?", [id]);

	if (title === undefined) title = entry.title;
	if (content === undefined) content = entry.content;
	if (type === undefined) type = entry.type;
	if (note === undefined) note = entry.note;

	return db.run("UPDATE entries SET title = ?, content = ?, type = ?, note = ? WHERE id = ?", [
		title,
		content,
		type,
		note,
		id,
	]);
};
