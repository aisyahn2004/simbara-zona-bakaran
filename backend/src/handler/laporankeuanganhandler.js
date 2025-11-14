import db from "../config/db.js";

export const getLaporanKeuangan = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Query pemasukan dari transaksi
    const [pemasukanResult] = await db.execute(
      "SELECT IFNULL(SUM(total_harga), 0) AS total_pemasukan FROM transaksi WHERE tanggal_waktu BETWEEN ? AND ?",
      [startDate || '2024-01-01', endDate || '2024-12-31']
    );

    // Query pengeluaran 
    const [pengeluaranResult] = await db.execute(
      "SELECT IFNULL(SUM(jumlah), 0) AS total_pengeluaran FROM pengeluaran WHERE tanggal BETWEEN ? AND ?",
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

export const getLaporanBulanan = async (req, res) => {
  try {
    const { year, month } = req.query;
    
    const [rows] = await db.query(
      `
      SELECT 
        DATE(tanggal_waktu) AS tanggal,
        COUNT(*) AS jumlah_transaksi,
        SUM(total_harga) AS total_harian
      FROM transaksi
      WHERE YEAR(tanggal_waktu) = ? AND MONTH(tanggal_waktu) = ?
      GROUP BY DATE(tanggal_waktu)
      ORDER BY tanggal DESC
      `,
      [year || 2024, month || 1]
    );

    const totalPenjualan = rows.reduce((acc, r) => acc + Number(r.total_harian || 0), 0);
    const jumlahTransaksi = rows.reduce((acc, r) => acc + Number(r.jumlah_transaksi || 0), 0);

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    res.status(200).json({
      periode: `${monthNames[month - 1] || 'Januari'} ${year || 2024}`,
      total_penjualan: totalPenjualan,
      jumlah_transaksi: jumlahTransaksi,
      rincian_harian: rows
    });
  } catch (error) {
    console.error("Error detail:", error);
    res.status(500).json({ message: "Gagal mengambil laporan bulanan" });
  }
};