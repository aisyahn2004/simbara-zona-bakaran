# Sistem Informasi Manajemen UMKM "Zona Bakaran"

## 1. Deskripsi Umum

Sistem Informasi Manajemen UMKM **Zona Bakaran** dikembangkan untuk membantu operasional usaha dimsum bakar yang masih mencatat stok dan penjualan secara manual di buku tulis. Hal ini sering menyebabkan data hilang, salah hitung, dan pemilik sulit memantau penjualan secara akurat.
Melalui sistem berbasis web ini, pencatatan transaksi, pengelolaan stok, dan laporan keuangan dilakukan secara digital dan terpusat.

Sistem ini bersifat **open source** sehingga dapat dimodifikasi dan digunakan oleh UMKM lain dengan kebutuhan serupa.

---

## 2. Tujuan Sistem

- Mempermudah pencatatan transaksi penjualan.
- Membantu pemilik usaha dan karyawan dalam memantau stok bahan dan produk secara _real-time_.
- Menghasilkan laporan keuangan penjualan dan pengeluaran secara otomatis.
- Mengurangi risiko kehilangan data dan kesalahan hitung.
- Mendukung proses digitalisasi UMKM agar lebih efisien.

---

## 3. Pengguna Sistem

**Pemilik (_Admin_):**

- Mengelola data produk dan stok.
- Melihat laporan penjualan dan keuangan.
- Mengelola akun pengguna (Karyawan).

**Karyawan**:

- Melakukan transaksi penjualan.
- Menginput pergerakan stok setelah penjualan.

---

## 4. Kebutuhan Fungsional

### A. Autentikasi Pengguna

- Login menggunakan username dan password.
- Sistem membedakan akses antara Admin dan Karyawan.
- Logout otomatis jika sesi tidak aktif.

### B. Manajemen Produk dan Stok

- Menambah, mengubah, atau menghapus data produk.
- Memperbarui stok otomatis saat transaksi terjadi.

### C. Transaksi Penjualan

- Memilih produk dan jumlah yang terjual.
- Menghitung total harga otomatis.
- Menyimpan detail transaksi (nama produk, jumlah, harga per item, subtotal).
- Mencatat metode pembayaran (tunai atau QRIS).

### D. Pencatatan Pengeluaran Usaha

- Menginput jenis pengeluaran, nominal, dan tanggal.
- Menyimpan riwayat pengeluaran untuk laporan.

### E. Laporan dan Monitoring

- Menampilkan laporan penjualan harian/mingguan/bulanan.
- Menampilkan total pendapatan dan total pengeluaran.
- Menyimpan log aktivitas (siapa yang mengubah stok, transaksi, atau pengeluaran, serta kapan).
- Ekspor laporan ke CSV atau Excel.

### F. Backup dan Data

- Sistem menyediakan fitur backup database ke file lokal.
- Pengguna dapat memulihkan data dari file backup.

---

## 5. Kebutuhan Non-Fungsional

### Keamanan

- Password disimpan dalam bentuk hash.
- Query database menggunakan parameterized statements.
- Form dilindungi token CSRF.

### Kemudahan Penggunaan

- Tampilan sederhana dan mudah dipahami oleh pengguna non-teknis.
- Bahasa tampilan menggunakan Bahasa Indonesia.

### Kinerja

- Waktu respon sistem maksimal 5 detik per permintaan.
- Sistem menyimpan minimal 500 transaksi tanpa error.

### Ketersediaan & Portabilitas

- Dapat dijalankan secara lokal di laptop.
- Bisa diakses melalui browser tanpa instalasi tambahan.

---

## 6. Lingkungan Pengembangan

- **Bahasa Pemrograman:** Node.js
- **Database:** MySQL
- **Tools:**
  - Visual Studio Code
  - MySQL Workbench
  - Draw.io
  - GitHub
  - Figma

---

## 7. Lisensi

Sistem ini menggunakan MIT License agar dapat digunakan, dimodifikasi, dan dikembangkan kembali oleh UMKM atau pengembang lain dengan tetap mencantumkan nama pembuat asli.

---

## Status Dokumen

Versi: Draft 1.0
Disusun oleh: Tim Proyek SIM Zona Bakaran
Tahun: 2025
