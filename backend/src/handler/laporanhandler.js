import db from "../config/db.js";

export const getLaporanPenjualan = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const [rows] = await db.query(
      `
      SELECT 
        DATE(tanggal_waktu) AS tanggal,
        COUNT(*) AS jumlah_transaksi,
        SUM(total_harga) AS total_harian
      FROM transaksi
      WHERE tanggal_waktu BETWEEN ? AND ?
      GROUP BY DATE(tanggal_waktu)
      ORDER BY tanggal_waktu DESC
      `,
      [startDate || '2025-01-01', endDate || '2025-12-31']
    );

    // Hitung total keseluruhan
    const totalPenjualan = rows.reduce((acc, r) => acc + Number(r.total_harian), 0);
    const jumlahTransaksi = rows.reduce((acc, r) => acc + Number(r.jumlah_transaksi), 0);

    res.status(200).json({
      periode: `${startDate || '2025-01-01'} - ${endDate || '2025-12-31'}`,
      total_penjualan: totalPenjualan,
      jumlah_transaksi: jumlahTransaksi,
      rincian: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil laporan penjualan" });
  }
};