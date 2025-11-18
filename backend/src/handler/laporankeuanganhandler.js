import db from "../config/db.js";

// Ringkasan keuangan
export const getLaporanKeuangan = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Total pemasukan
    const [pemasukanResult] = await db.execute(
      "SELECT IFNULL(SUM(total_harga), 0) AS total_pemasukan FROM transaksi WHERE tanggal_waktu BETWEEN ? AND ?",
      [startDate || '2024-01-01', endDate || '2024-12-31']
    );

    // Total pengeluaran
    const [pengeluaranResult] = await db.execute(
      "SELECT IFNULL(SUM(total_harga), 0) AS total_pengeluaran FROM pengeluaran WHERE tanggal BETWEEN ? AND ?",
      [startDate || '2024-01-01', endDate || '2024-12-31']
    );

    const total_pemasukan = parseFloat(pemasukanResult[0].total_pemasukan);
    const total_pengeluaran = parseFloat(pengeluaranResult[0].total_pengeluaran);
    const saldo_bersih = total_pemasukan - total_pengeluaran;

    res.status(200).json({
      periode: `${startDate || '2024-01-01'} - ${endDate || '2024-12-31'}`,
      total_pemasukan,
      total_pengeluaran,
      saldo_bersih,
    });
  } catch (error) {
    console.error("Error saat mengambil laporan keuangan:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

// Laporan bulanan (pendapatan + pengeluaran)
export const getLaporanBulanan = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Ambil pendapatan
    const [pendapatan] = await db.query(`
      SELECT DATE(tanggal_waktu) AS tanggal,
             COUNT(*) AS jumlah_transaksi,
             SUM(total_harga) AS total_harian,
             'Pendapatan' AS jenis
      FROM transaksi
      WHERE tanggal_waktu BETWEEN ? AND ?
      GROUP BY DATE(tanggal_waktu)
      ORDER BY tanggal DESC
    `, [startDate, endDate]);

    // Ambil pengeluaran
    const [pengeluaran] = await db.query(`
      SELECT DATE(tanggal) AS tanggal,
             COUNT(*) AS jumlah_transaksi,
             SUM(total_harga) AS total_harian,
             'Pengeluaran' AS jenis
      FROM pengeluaran
      WHERE tanggal BETWEEN ? AND ?
      GROUP BY DATE(tanggal)
      ORDER BY tanggal DESC
    `, [startDate, endDate]);

    // Gabungkan
    const rows = [...pendapatan, ...pengeluaran]
      .sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal)); // urut descending

    res.status(200).json({ rincian_harian: rows });
  } catch (error) {
    console.error("Error mengambil laporan bulanan:", error);
    res.status(500).json({ message: "Gagal mengambil laporan bulanan" });
  }
};
