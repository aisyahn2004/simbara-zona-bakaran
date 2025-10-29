import db from "../config/db.js";
import jwt from "jsonwebtoken";

// Tambah Produk Baru
export const addProduct = async (req, res) => {
  try {
    const { nama_produk, harga_satuan, stok_tersedia, stok_minimum } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const [result] = await db.query(
      "INSERT INTO produk (user_id, nama_produk, harga_satuan, stok_tersedia, stok_minimum) VALUES (?, ?, ?, ?, ?)",
      [user_id, nama_produk, harga_satuan, stok_tersedia, stok_minimum]
    );

    res.status(201).json({ message: "Produk berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menambah produk" });
  }
};

// Update Produk
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_produk, harga_satuan, stok_minimum } = req.body;

    await db.query(
      "UPDATE produk SET nama_produk=?, harga_satuan=?, stok_minimum=? WHERE produk_id=?",
      [nama_produk, harga_satuan, stok_minimum, id]
    );

    res.json({ message: "Produk berhasil diperbarui" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui produk" });
  }
};

// Hapus Produk
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM produk WHERE produk_id=?", [id]);
    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus produk" });
  }
};


// Notifikasi Stok Menipis
export const getLowStockProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produk WHERE stok_tersedia <= stok_minimum");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data stok menipis" });
  }
};


// Laporan Penjualan & Keuangan
export const getSalesReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.transaksi_id,
        t.tanggal_waktu,
        u.nama AS nama_karyawan,
        t.total_harga,
        t.metode_pembayaran
      FROM transaksi t
      JOIN user u ON t.user_id = u.user_id
      ORDER BY t.tanggal_waktu DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil laporan penjualan" });
  }
};


// Laporan Pengeluaran
export const getExpenseReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.pengeluaran_id,
        p.kategori,
        p.deskripsi,
        p.jumlah,
        p.tanggal,
        u.nama AS nama_admin
      FROM pengeluaran p
      JOIN user u ON p.user_id = u.user_id
      ORDER BY p.tanggal DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil laporan pengeluaran" });
  }
};
