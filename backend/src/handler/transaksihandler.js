import db from "../config/db.js";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

// =======================================
// 1️⃣ BUAT TRANSAKSI (POTONG STOK UKURAN)
// =======================================
export const createTransaction = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Token tidak ditemukan" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "karyawan") {
      return res
        .status(403)
        .json({ message: "Hanya karyawan yang dapat melakukan transaksi" });
    }

    const { products, metode_pembayaran } = req.body;
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Produk tidak boleh kosong" });
    }

    const tanggal_waktu = dayjs().format("YYYY-MM-DD HH:mm:ss");
    let totalHarga = 0;

    await db.query("START TRANSACTION");

    // Simpan transaksi utama
    const [insertTrx] = await db.query(
      `INSERT INTO transaksi (user_id, tanggal_waktu, total_harga, metode_pembayaran)
       VALUES (?, ?, 0, ?)`,
      [decoded.user_id, tanggal_waktu, metode_pembayaran]
    );

    const transaksi_id = insertTrx.insertId;

    // Loop semua produk
    for (const item of products) {
      const { produk_id, jumlah } = item;

      // Ambil info produk
      const [prod] = await db.query(
        `SELECT harga_satuan FROM produk WHERE produk_id=?`,
        [produk_id]
      );
      if (prod.length === 0) throw new Error(`Produk ID ${produk_id} tidak ditemukan`);

      const harga = prod[0].harga_satuan;
      const subtotal = harga * jumlah;
      totalHarga += subtotal;

      // Simpan ke detail_transaksi
      await db.query(
        `INSERT INTO detail_transaksi (transaksi_id, produk_id, jumlah, subtotal)
         VALUES (?, ?, ?, ?)`,
        [transaksi_id, produk_id, jumlah, subtotal]
      );

      // Ambil resep menu → ukuran & jumlah pcs
      const [resep] = await db.query(
        `SELECT ukuran_id, jumlah_pcs FROM menu_resep WHERE produk_id=?`,
        [produk_id]
      );
      if (resep.length === 0)
        throw new Error(`Resep menu tidak ditemukan untuk produk ID ${produk_id}`);

      const { ukuran_id, jumlah_pcs } = resep[0];
      const totalPengurangan = jumlah_pcs * jumlah;

      // Ambil stok ukuran
      const [ukuranRows] = await db.query(
        `SELECT stok FROM ukuran_dimsum WHERE ukuran_id=?`,
        [ukuran_id]
      );
      if (ukuranRows.length === 0)
        throw new Error(`Data ukuran dimsumnya tidak ditemukan (ukuran_id ${ukuran_id})`);

      const stokSebelum = ukuranRows[0].stok;
      if (stokSebelum < totalPengurangan)
        throw new Error(`Stok kurang! (ukuran_id ${ukuran_id} hanya ${stokSebelum} pcs)`);

      const stokSesudah = stokSebelum - totalPengurangan;

      // Update stok ukuran
      await db.query(`UPDATE ukuran_dimsum SET stok=? WHERE ukuran_id=?`, [
        stokSesudah,
        ukuran_id,
      ]);

      // Log stok
      await db.query(
        `INSERT INTO stok_log 
          (produk_id, ukuran_id, user_id, tipe_aktivitas, jumlah_perubahan, stok_sebelum, stok_akhir, tanggal_waktu)
         VALUES (?, ?, ?, 'keluar', ?, ?, ?, NOW())`,
        [produk_id, ukuran_id, decoded.user_id, totalPengurangan, stokSebelum, stokSesudah]
      );
    }

    // Update total harga transaksi
    await db.query(`UPDATE transaksi SET total_harga=? WHERE transaksi_id=?`, [
      totalHarga,
      transaksi_id,
    ]);

    await db.query("COMMIT");

    res.status(201).json({
      message: "Transaksi berhasil disimpan",
      transaksi_id,
      total_harga: totalHarga,
      metode_pembayaran,
      tanggal_waktu,
    });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error transaksi:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================================
// 2️⃣ GET LIST TRANSAKSI (ADMIN)
// =======================================
export const getAlltransaksi = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Hanya admin yang boleh melihat transaksi" });
    }

    const [rows] = await db.query(`
      SELECT 
        t.transaksi_id,
        u.nama AS nama_karyawan,
        t.tanggal_waktu,
        t.total_harga,
        t.metode_pembayaran,
        GROUP_CONCAT(CONCAT(p.nama_produk, ' (', d.jumlah, 'x)') SEPARATOR ', ') AS produk_dibeli
      FROM transaksi t
      JOIN user u ON t.user_id = u.user_id
      JOIN detail_transaksi d ON t.transaksi_id = d.transaksi_id
      JOIN produk p ON d.produk_id = p.produk_id
      GROUP BY t.transaksi_id
      ORDER BY t.tanggal_waktu DESC
    `);

    res.json({ total_transaksi: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil transaksi" });
  }
};

// =======================================
// 3️⃣ GET TRANSAKSI BY ID (ADMIN)
// =======================================
export const getTransactionById = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Hanya admin yang boleh melihat detail transaksi" });
    }

    const { id } = req.params;

    const [trx] = await db.query(
      `SELECT t.*, u.nama AS nama_karyawan
       FROM transaksi t
       JOIN user u ON t.user_id = u.user_id
       WHERE transaksi_id=?`,
      [id]
    );

    if (trx.length === 0)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    const [detail] = await db.query(
      `SELECT p.nama_produk, d.jumlah, d.subtotal
       FROM detail_transaksi d
       JOIN produk p ON d.produk_id = p.produk_id
       WHERE transaksi_id=?`,
      [id]
    );

    res.json({ transaksi: trx[0], detail_produk: detail });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil detail transaksi" });
  }
};

export const getDetailHarian = async (req, res) => {
  try {
    const tanggal = req.query.tanggal;
    if (!tanggal) return res.status(400).json({ message: "Tanggal harus diisi" });

    const start = `${tanggal} 00:00:00`;
    const end = `${tanggal} 23:59:59`;

    const [rows] = await db.query(
  `
    SELECT
      t.transaksi_id,
      u.nama AS nama_karyawan,
      t.total_harga,
      t.metode_pembayaran,
      DATE_FORMAT(t.tanggal_waktu, '%Y-%m-%d %H:%i:%s') AS tanggal_waktu
    FROM transaksi t
    JOIN user u ON t.user_id = u.user_id
    WHERE t.tanggal_waktu BETWEEN ? AND ?
    ORDER BY t.tanggal_waktu DESC
  `,
  [start, end]
);



    res.json({
      tanggal,
      jumlah_transaksi: rows.length,
      data: rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil detail harian" });
  }
};





