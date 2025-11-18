import db from "../config/db.js";

export const getLaporanPenjualan = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      const today = new Date();
      const first = new Date(today.getFullYear(), today.getMonth(), 1);

      startDate = startDate || first.toISOString().split("T")[0];
      endDate = endDate || today.toISOString().split("T")[0];
    }

    const startFull = `${startDate} 00:00:00`;
    const endFull = `${endDate} 23:59:59`;

   const [rows] = await db.query(
  `
    SELECT 
      DATE_FORMAT(t.tanggal_waktu, '%Y-%m-%d') AS tanggal,
      COUNT(*) AS jumlah_transaksi,
      SUM(t.total_harga) AS total_harian
    FROM transaksi t
    WHERE t.tanggal_waktu BETWEEN ? AND ?
    GROUP BY DATE(t.tanggal_waktu)
    ORDER BY tanggal DESC
  `,
  [startFull, endFull]
);



    const totalPenjualan = rows.reduce((a, r) => a + Number(r.total_harian || 0), 0);
    const jumlahTransaksi = rows.reduce((a, r) => a + Number(r.jumlah_transaksi || 0), 0);

    res.status(200).json({
      periode: `${startDate} - ${endDate}`,
      total_penjualan: totalPenjualan,
      jumlah_transaksi: jumlahTransaksi,
      rincian: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil laporan penjualan" });
  }
};
