import db from "../config/db.js";

export const getLaporanPenjualan = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startDate = startDate || firstDayOfMonth.toISOString().split('T')[0];
      endDate = endDate || today.toISOString().split('T')[0];
    }

    const [rows] = await db.query(
      `
      SELECT 
        DATE(tanggal_waktu) AS tanggal,
        COUNT(*) AS jumlah_transaksi,
        SUM(total_harga) AS total_harian
      FROM transaksi
      WHERE tanggal_waktu BETWEEN ? AND ?
      GROUP BY DATE(tanggal_waktu)
      ORDER BY tanggal DESC
      `,
      [startDate, endDate]
    );

    const totalPenjualan = rows.reduce((acc, r) => acc + Number(r.total_harian || 0), 0);
    const jumlahTransaksi = rows.reduce((acc, r) => acc + Number(r.jumlah_transaksi || 0), 0);

    res.status(200).json({
      periode: `${startDate} - ${endDate}`,
      total_penjualan: totalPenjualan,
      jumlah_transaksi: jumlahTransaksi,
      rincian: rows
    });
  } catch (error) {
    console.error("Error detail:", error);
    res.status(500).json({ message: "Gagal mengambil laporan penjualan" });
  }
};