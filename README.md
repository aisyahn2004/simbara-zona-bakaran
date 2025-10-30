# SIMBARA — Sistem Informasi Manajemen Zona Bakaran
## Deskripsi Proyek

SIMBARA (Sistem Informasi Manajemen Zona Bakaran) adalah aplikasi berbasis web yang dirancang untuk membantu UMKM Zona Bakaran dalam mendigitalisasi proses operasional usaha mereka. 

Sistem ini dikembangkan untuk memudahkan pengelolaan data penjualan, stok bahan, dan laporan keuangan secara terintegrasi. 

## Tujuan Pengembangan
- Mendukung digitalisasi UMKM lokal dalam operasional bisnis.
- Mengurangi risiko kehilangan data akibat pencatatan manual.
- Mempermudah pemilik usaha dalam memantau penjualan, stok, dan laporan keuangan. 
- Menyediakan sistem open source yang dapat digunakan ulang oleh UMKM lain

## Fitur Utama:

- Autentikasi Pengguna: Login, logout, dan pengelolaan akun berbasis peran (Admin & Karyawan). 
- Manajemen Penjualan: Tambah, ubah, dan hapus data produk, serta pencatatan stok otomatis setiap transaksi. 
- Manajemen Stok: Pemantauan stok produk dan bahan baku.
- Notifikasi Stok Menipis: Sistem memberi peringatan otomatis jika stok produk mencapai batas minimum. 
- Laporan Keuangan: Laporan penjualan dan pengeluaran yang dapat diekspor.
- Log Aktivitas: Riwayat kegiatan Karyawan dapat dipantau oleh Admin. 
- Hak Akses Berbeda:
  * Admin/Owner: Mengelola data produk, pengguna, dan laporan.
  * Karyawan: Mencatat transaksi penjualan dan pembaruan stok.

## Frontend Tech Stack 
- HTML
- Tailwind CSS
- JavaScript

Tools Pengembangan:
- Visual Studio Code
- Git & GitHub
- Figma 

# Backend Tech Stack 
- Node.js
- Express.js
- MySQL
- JWT (JSON Web Token)
- bcrypt

Tools Pengembangan:
- Visual Studio Code
- Postman
- Git & GitHub

## Database 
Sistem menggunakan MySQL dengan struktur database mencakup tabel:
- user
- produk
- transaksi
- pengeluaran
- detail_transaksi
- stok_log

## Dokumentasi Desain Sistem
Lihat diagram lengkap di folder [docs/](./docs):
- [Use Case Diagram](./docs/usecase-zonabakaran.png)
- [Entity Relationship Diagram (ERD)](./docs/erd-zonabakaran.png)

## Lisensi 
Sistem ini menggunakan **MIT License** agar dapat digunakan, dimodifikasi, dan dikembangkan kembali oleh UMKM atau pengembang lain dengan tetap mencantumkan nama pengembang aslinya. 

## Kontributor
Proyek ini dikembangkan oleh tim mahasiswa untuk memenuhi tugas mata kuliah Teknologi Open-Source dan Terbaru. 

