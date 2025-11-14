import db from "../config/db.js";
import jwt from "jsonwebtoken";

/* =====================================================
   1. Tambah Produk Baru + Resep Menu
   (stok ada di ukuran_dimsum, jadi tidak disimpan di produk)
======================================================*/
export const addProduct = async (req, res) => {
  try {
    const { nama_produk, harga_satuan, kategori_id, ukuran_id, jumlah_pcs } = req.body;

    if (!ukuran_id || !jumlah_pcs) {
      return res.status(400).json({
        message: "Ukuran dan jumlah_pcs (resep) wajib diisi",
      });
    }

    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    await db.query("START TRANSACTION");

    // Insert produk
    const [result] = await db.query(
      `
      INSERT INTO produk (user_id, kategori_id, nama_produk, harga_satuan)
      VALUES (?, ?, ?, ?)
    `,
      [user_id, kategori_id, nama_produk, harga_satuan]
    );

    const produk_id = result.insertId;

    // Insert resep menu
    await db.query(
      `
      INSERT INTO menu_resep (produk_id, ukuran_id, jumlah_pcs)
      VALUES (?, ?, ?)
    `,
      [produk_id, ukuran_id, jumlah_pcs]
    );

    await db.query("COMMIT");

    res.status(201).json({
      message: "Produk + resep berhasil ditambahkan",
      produk_id,
    });

  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Gagal menambah produk" });
  }
};


/* =====================================================
   2. Ambil Produk + Kategori + Resep Menu
======================================================*/
export const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.produk_id,
        p.nama_produk,
        p.harga_satuan,
        p.kategori_id,
        k.nama_kategori,
        r.ukuran_id,
        u.nama_ukuran,
        r.jumlah_pcs
      FROM produk p
      LEFT JOIN kategoriproduk k ON p.kategori_id = k.kategori_id
      LEFT JOIN menu_resep r ON p.produk_id = r.produk_id
      LEFT JOIN ukuran_dimsum u ON r.ukuran_id = u.ukuran_id
      ORDER BY p.produk_id ASC
    `);

    res.json(rows);

  } catch (error) {
    console.error("Error mengambil data produk:", error);
    res.status(500).json({ message: "Gagal mengambil data produk" });
  }
};


/* =====================================================
   3. Update Produk + Update Resep Menu
======================================================*/
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_produk, harga_satuan, kategori_id, ukuran_id, jumlah_pcs } = req.body;

    await db.query("START TRANSACTION");

    // Update produk
    await db.query(
      `
      UPDATE produk
      SET nama_produk=?, harga_satuan=?, kategori_id=?
      WHERE produk_id=?
    `,
      [nama_produk, harga_satuan, kategori_id, id]
    );

    // Update resep
    await db.query(
      `
      UPDATE menu_resep
      SET ukuran_id=?, jumlah_pcs=?
      WHERE produk_id=?
    `,
      [ukuran_id, jumlah_pcs, id]
    );

    await db.query("COMMIT");

    res.json({ message: "Produk + resep berhasil diperbarui" });

  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui produk" });
  }
};


/* =====================================================
   4. Ambil Semua Kategori
======================================================*/
export const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM kategoriproduk ORDER BY kategori_id ASC");
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data kategori" });
  }
};


/* =====================================================
   5. Hapus Produk + Hapus Resep
======================================================*/
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("START TRANSACTION");

    await db.query("DELETE FROM menu_resep WHERE produk_id=?", [id]);
    await db.query("DELETE FROM produk WHERE produk_id=?", [id]);

    await db.query("COMMIT");

    res.json({ message: "Produk berhasil dihapus" });

  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus produk" });
  }
};


/* =====================================================
   6. Notifikasi Stok Menipis
   (berdasarkan ukuran dimsumnya)
======================================================*/
export const getLowStockProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.ukuran_id,
        u.nama_ukuran,
        u.stok AS stok_tersedia,
        u.stok_minimum
      FROM ukuran_dimsum u
      WHERE u.stok <= u.stok_minimum
    `);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data stok menipis" });
  }
};


/* =====================================================
   7. Laporan Penjualan
======================================================*/
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


/* =====================================================
   8. Laporan Pengeluaran
======================================================*/
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
