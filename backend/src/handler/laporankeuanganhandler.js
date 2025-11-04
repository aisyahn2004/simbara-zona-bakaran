import db from "../config/db.js";

export const getLaporanKeuangan = async (req, res) => {
  try {
    // Hitung total pemasukan (dari transaksi)
    const [pemasukanResult] = await db.execute(
      "SELECT IFNULL(SUM(total_harga), 0) AS total_pemasukan FROM transaksi"
    );

    // Hitung total pengeluaran (dari tabel pengeluaran)
    const [pengeluaranResult] = await db.execute(
      "SELECT IFNULL(SUM(jumlah), 0) AS total_pengeluaran FROM pengeluaran"
    );

    const total_pemasukan = parseFloat(pemasukanResult[0].total_pemasukan);
    const total_pengeluaran = parseFloat(pengeluaranResult[0].total_pengeluaran);
    const saldo_bersih = total_pemasukan - total_pengeluaran;

    res.status(200).json({
      periode: "2025-01-01 - 2025-12-31", 
      total_pemasukan,
      total_pengeluaran,
      saldo_bersih,
    });
  } catch (error) {
    console.error("Error saat mengambil laporan keuangan:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};
