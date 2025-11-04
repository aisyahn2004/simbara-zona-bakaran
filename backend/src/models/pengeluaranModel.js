import db from "../config/db.js";

export const createPengeluaran = async ({ user_id, tanggal, deskripsi, jumlah }) => {
  const [result] = await db.query(
    "INSERT INTO pengeluaran (user_id, tanggal, deskripsi, jumlah) VALUES (?, ?, ?, ?)",
    [user_id, tanggal, deskripsi, jumlah]
  );
  return result.insertId;
};

export const getAllPengeluaran = async () => {
  const [rows] = await db.query("SELECT * FROM pengeluaran ORDER BY tanggal DESC");
  return rows;
};

export const getPengeluaranById = async (id) => {
  const [rows] = await db.query("SELECT * FROM pengeluaran WHERE id = ?", [id]);
  return rows[0];
};

export const updatePengeluaran = async (id, data) => {
  const { tanggal, deskripsi, jumlah } = data;
  await db.query(
    "UPDATE pengeluaran SET tanggal = ?, deskripsi = ?, jumlah = ? WHERE id = ?",
    [tanggal, deskripsi, jumlah, id]
  );
};

export const deletePengeluaran = async (id) => {
  await db.query("DELETE FROM pengeluaran WHERE id = ?", [id]);
};
