import {
  createPengeluaran,
  getAllPengeluaran,
  getPengeluaranById,
  updatePengeluaran,
  deletePengeluaran,
} from "../models/pengeluaranModel.js";

// Tambah data pengeluaran
export const addPengeluaran = async (req, res) => {
  try {
    const { user_id, tanggal, kategori, deskripsi, jumlah, harga } = req.body;

    if (!user_id || !tanggal || !kategori || !deskripsi || !jumlah || !harga) {
      return res.status(400).json({ message: "Semua field wajib diisi termasuk user_id." });
    }

    const total_harga = jumlah * harga;

    const id = await createPengeluaran({
      user_id,
      tanggal,
      kategori,
      deskripsi,
      jumlah,
      harga,
      total_harga,
    });

    res.status(201).json({
      message: "Pengeluaran berhasil ditambahkan",
      id,
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Ambil semua pengeluaran
export const getPengeluaranList = async (req, res) => {
  try {
    const data = await getAllPengeluaran();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data pengeluaran" });
  }
};

// Ambil detail pengeluaran
export const getPengeluaranDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getPengeluaranById(id);

    if (!data) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil detail pengeluaran" });
  }
};

// Update pengeluaran
export const editPengeluaran = async (req, res) => {
  try {
    const { id } = req.params;
    const { tanggal, kategori, deskripsi, jumlah, harga } = req.body;

    await updatePengeluaran(id, { tanggal, kategori, deskripsi, jumlah, harga });

    res.json({ message: "Pengeluaran berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui pengeluaran" });
  }
};


// Hapus pengeluaran
export const removePengeluaran = async (req, res) => {
  try {
    const { id } = req.params;
    await deletePengeluaran(id);

    res.json({ message: "Pengeluaran berhasil dihapus" });

  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus pengeluaran" });
  }
};
