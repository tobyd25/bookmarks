export const getEntries = (db) => {
    return db.all("SELECT * FROM entries")
}