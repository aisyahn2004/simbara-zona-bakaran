import db from "../config/db.js";

// Dashboard Ringkasan
export const getDashboard = async (req, res) => {
  try {
    // Total transaksi
    const [[{ total_transaksi }]] = await db.query(
      "SELECT COUNT(*) AS total_transaksi FROM transaksi"
    );

    // Total produk terjual (jumlah di detail_transaksi)
    const [[{ total_produk_terjual }]] = await db.query(
      "SELECT COALESCE(SUM(jumlah), 0) AS total_produk_terjual FROM detail_transaksi"
    );

    // Total pendapatan (sum total_harga)
    const [[{ total_pendapatan }]] = await db.query(
      "SELECT COALESCE(SUM(total_harga), 0) AS total_pendapatan FROM transaksi"
    );

    // Total transaksi per metode pembayaran
    const [metode] = await db.query(`
      SELECT 
        metode_pembayaran, 
        COUNT(*) AS jumlah_transaksi 
      FROM transaksi 
      GROUP BY metode_pembayaran
    `);

    res.json({
      total_transaksi,
      total_produk_terjual,
      total_pendapatan,
      metode_pembayaran: metode,
    });
  } catch (err) {
    console.error("Error dashboard summary:", err);
    res.status(500).json({ message: "Gagal mengambil ringkasan dashboard" });
  }
};

// riwayat aktivitas 
export const getAktivitasTerbaru = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.transaksi_id,
        u.nama AS nama_karyawan,
        t.tanggal_waktu,
        t.metode_pembayaran,
        t.total_harga,
        GROUP_CONCAT(p.nama_produk SEPARATOR ', ') AS produk_dipesan
      FROM transaksi t
      JOIN user u ON t.user_id = u.user_id
      JOIN detail_transaksi d ON t.transaksi_id = d.transaksi_id
      JOIN produk p ON d.produk_id = p.produk_id
      GROUP BY t.transaksi_id, u.nama, t.tanggal_waktu, t.metode_pembayaran, t.total_harga
      ORDER BY t.tanggal_waktu DESC
      LIMIT 10
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error recent activities:", err);
    res.status(500).json({ message: "Gagal mengambil riwayat aktivitas" });
  }
};
