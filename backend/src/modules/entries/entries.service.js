export const getEntries = (db) => {
    return db.all("SELECT * FROM entries")
}

export const createEntry = (db) => {
    return db.run("INSERT INTO entries DEFAULT VALUES")
}

export const putEntry = (db, id, title, content, type, note) => {
    return db.run("UPDATE entries SET title = ?, content = ?, type = ?, note = ? WHERE id = ?", [title, content, type, note, id])
}