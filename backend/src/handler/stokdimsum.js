import db from "../config/db.js";

// =====================================================
// 1️⃣ Ambil Semua Stok
// =====================================================
export const getStock = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ukuran_id, nama_ukuran, stok, stok_minimum
      FROM ukuran_dimsum
      ORDER BY ukuran_id ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil stok" });
  }
};

// =====================================================
// 2️⃣ Tambah Stok Baru / Ukuran Baru
// =====================================================
export const addStock = async (req, res) => {
  try {
    const { nama_ukuran, stok, stok_minimum } = req.body;

    if (!nama_ukuran || stok === undefined || stok_minimum === undefined) {
      return res.status(400).json({ message: "Data stok lengkap wajib diisi" });
    }

    const [result] = await db.query(
      `INSERT INTO ukuran_dimsum (nama_ukuran, stok, stok_minimum)
       VALUES (?, ?, ?)`,
      [nama_ukuran, stok, stok_minimum]
    );

    res.status(201).json({
      message: "Ukuran & stok berhasil ditambahkan",
      ukuran_id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menambahkan stok" });
  }
  console.log("REQ BODY =", req.body);
};

// =====================================================
// 3️⃣ Update Stok (Mini/Jumbo)
// =====================================================
export const updateStock = async (req, res) => {
  try {
    const { ukuran_id } = req.params;
    const { stok } = req.body;

    if (stok === undefined) {
      return res.status(400).json({ message: "Stok wajib diisi" });
    }

    await db.query(`UPDATE ukuran_dimsum SET stok=? WHERE ukuran_id=?`, [
      stok,
      ukuran_id,
    ]);

    res.json({ message: "Stok berhasil diperbarui" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui stok" });
  }
};

// =====================================================
// 4️⃣ Hapus Stok / Ukuran
// =====================================================
export const deleteStock = async (req, res) => {
  try {
    const { ukuran_id } = req.params;

    await db.query(`DELETE FROM ukuran_dimsum WHERE ukuran_id=?`, [ukuran_id]);

    res.json({ message: "Stok / ukuran berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus stok" });
  }
};
