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
	title: string,
	content: string,
	type: string,
	note: string,
) => {
	return db.run("UPDATE entries SET title = ?, content = ?, type = ?, note = ? WHERE id = ?", [
		title,
		content,
		type,
		note,
		id,
	]);
};
