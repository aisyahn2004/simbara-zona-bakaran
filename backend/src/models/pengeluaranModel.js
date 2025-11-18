import db from "../config/db.js";

export const createPengeluaran = async ({ user_id, tanggal, kategori, deskripsi, jumlah, harga }) => {
  const total_harga = jumlah * harga;

  const [result] = await db.query(
    "INSERT INTO pengeluaran (user_id, tanggal, kategori, deskripsi, jumlah, harga, total_harga) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [user_id, tanggal, kategori, deskripsi, jumlah, harga, total_harga]
  );

  return result.insertId;
};



export const getAllPengeluaran = async () => {
  const [rows] = await db.query("SELECT * FROM pengeluaran ORDER BY tanggal DESC");
  return rows;
};

export const getPengeluaranById = async (id) => {
  const [rows] = await db.query("SELECT * FROM pengeluaran WHERE pengeluaran_id = ?", [id]);
  return rows[0];
};



export const updatePengeluaran = async (id, data) => {
  const { tanggal, kategori, deskripsi, jumlah, harga } = data;
  const total_harga = jumlah * harga;

  await db.query(
    "UPDATE pengeluaran SET tanggal = ?, kategori = ?, deskripsi = ?, jumlah = ?, harga = ?, total_harga = ? WHERE pengeluaran_id = ?",
    [tanggal, kategori, deskripsi, jumlah, harga, total_harga, id]
  );
};



export const deletePengeluaran = async (id) => {
  await db.query("DELETE FROM pengeluaran WHERE pengeluaran_id = ?", [id]);
};
