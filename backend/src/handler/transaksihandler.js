import db from "../config/db.js";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

export const createTransaction = async (req, res) => {
  try {
    //Verifikasi token login klo cuman bisa buat karyawan aja
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Token tidak ditemukan" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "karyawan") {
      return res.status(403).json({ message: "Hanya karyawan yang dapat melakukan transaksi" });
    }

    const { products, metode_pembayaran } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Produk tidak boleh kosong" });
    }

    //Buat data transaksi
    const tanggal_waktu = dayjs().format("YYYY-MM-DD HH:mm:ss");
    let total_harga = 0;

    // Mulai transaksi (atomic)
    await db.query("START TRANSACTION");

    // Simpan data transaksi utama
    const [resultTransaksi] = await db.query(
      `INSERT INTO transaksi (user_id, tanggal_waktu, total_harga, metode_pembayaran)
       VALUES (?, ?, ?, ?)`,
      [decoded.id, tanggal_waktu, 0, metode_pembayaran]
    );

    const transaksi_id = resultTransaksi.insertId;

    // Simpan detail produk
    for (const item of products) {
      const [produkRows] = await db.query(
        "SELECT harga_satuan, stok_tersedia FROM produk WHERE produk_id = ?",
        [item.produk_id]
      );

      if (produkRows.length === 0) {
        throw new Error(`Produk dengan ID ${item.produk_id} tidak ditemukan`);
      }

      const { harga_satuan, stok_tersedia } = produkRows[0];

      if (stok_tersedia < item.jumlah) {
        throw new Error(`Stok tidak mencukupi untuk produk ID ${item.produk_id}`);
      }

      const subtotal = harga_satuan * item.jumlah;
      total_harga += subtotal;

      await db.query(
        `INSERT INTO detail_transaksi (transaksi_id, produk_id, jumlah, subtotal)
         VALUES (?, ?, ?, ?)`,
        [transaksi_id, item.produk_id, item.jumlah, subtotal]
      );

      // Kurangi stok
      await db.query(
        "UPDATE produk SET stok_tersedia = stok_tersedia - ? WHERE produk_id = ?",
        [item.jumlah, item.produk_id]
      );
    }

    // Update total harga di tabel transaksi
    await db.query("UPDATE transaksi SET total_harga = ? WHERE transaksi_id = ?", [
      total_harga,
      transaksi_id,
    ]);

    // Commit transaksi
    await db.query("COMMIT");

    res.status(201).json({
      message: "Transaksi berhasil disimpan",
      transaksi_id,
      total_harga,
      metode_pembayaran,
      tanggal_waktu,
    });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error transaksi:", error);
    res.status(500).json({ message: error.message || "Terjadi kesalahan server" });
  }
};
