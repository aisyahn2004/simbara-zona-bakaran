# API Specification 

Dokumentasi ini berisi daftar endpoint REST API untuk **Sistem Informasi Manajemen UMKM Zona Bakaran** yang dibangun menggunakan **Node.js (Express.js)** dan **MySQL**. Semua data dikirim dan diterima dalam format **JSON**.  

---

### Autentikasi
Semua endpoint (kecuali login) memerlukan header Authorization dengan format: 
Authorization: Bearer <token JWT>

---

**Base URL:** [update soon]

---

**Status Code:**     
200 OK - Permintaan Berhasil  
201 Created - Data berhasil dibuat   
400 Bad Request - Data tidak valid   
401 Unauthorized - Token tidak valid   
404 Not Found - Data tidak ditemukan   
500 Internal Server Error - Kesalahan Server   

---

## 1. Autentikasi Pengguna

### **1.1 Login**
**Endpoint:**  
`POST /api/auth/login`

**Deskripsi:**  
Login pengguna berdasarkan username dan password (Mengembalikan token JWT untuk autentikasi).

**Request Body:**
```json
{
  "username": "owner",
  "password": "password123"
}
```
**Response (200 OK):**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "nama": "Owner Zona Bakaran",
    "role": "admin"
  }
}
```
**Response (400 Bad Request):**
```json
{
  "error": "Username atau password tidak boleh kosong"
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Username atau Password salah"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Terjadi kesalahan pada server"
}
```

## 2. Manajemen Produk

### **2.1 Mendapatkan Semua Produk**
**Endpoint:**  
`GET /api/produk`

**Headers:**
Authorization: Bearer <token>

**Deskripsi:**  
Mengambil seluruh data produk yang tersedia.

**Response (200 OK):**
```json
[
  {
    "produk_id": 1,
    "user_id": 2, 
    "nama_produk": "Dimsum Jumbo 4pcs",
    "harga_satuan": 16000,
    "stok_tersedia": 30,
    "stok_minimum": 10
  },
  {
    "produk_id": 2,
    "user_id": 3,
    "nama_produk": "Dimsum Mini 6pcs",
    "harga_satuan": 18000,
    "stok_tersedia": 50,
    "stok_minimum": 10
  }
]
```

**Response (404 Not Found):**
```json
{
  "error": "Produk tidak ditemukan"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Terjadi kesalahan pada server"
}
```

### 2.2 Menambahkan Produk Baru
**Endpoint:**
`POST /api/produk`

**Headers:**
Authorization: Bearer <token>

**Deskripsi:**
Menambahkan data produk baru. 

**Request Body:**
```json
{
  "user_id": 4,
  "nama_produk": "Dakkochi 1pcs",
  "harga_satuan": 5000,
  "stok_tersedia": 25,
  "stok_minimum": 10
}
```

**Response (201 Created):**
```json
{
  "message": "Produk berhasil ditambahkan",
  "produk_id": 10
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Data produk tidak lengkap"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Terjadi kesalahan pada server"
}
```

### 2.3 Memperbarui Produk 
**Endpoint:**
`PUT /api/produk/:id`

**Headers:**
Authorization: Bearer <token>

**Deskripsi:**
Memperbarui informasi produk berdasarkan ID.

**Request Body:**
```json
{
  "user_id": 6, 
  "nama_produk": "Dimsum Mentai Jumbo 5pcs",
  "harga_satuan": 22000,
  "stok_tersedia": 18,
  "stok_minimum": 10
}
```

**Response (200 OK):**
```json
{
  "message": "Data produk berhasil diperbarui"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Data produk gagal diperbarui"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Terjadi kesalahan pada server"
}
```

### 2.4 Menghapus Produk 
**Endpoint:**
`DELETE /api/produk/:id`

**Headers:**
Authorization: Bearer <token>

**Deskripsi:**
Menghapus produk tertentu berdasarkan ID.

**Response (200 OK):**
```json
{
  "message": "Produk berhasil dihapus"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Produk tidak ditemukan"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Produk gagal dihapus"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Terjadi kesalahan pada server"
}
```

### 2.5 Mendapatkan Detail Produk 
**Endpoint:**
`GET /api/produk/:id`

**Headers:**
Authorization: Bearer <token>

**Deskripsi:**
Mengambil data produk tertentu berdasarkan ID (Digunakan untuk tampilan detail produk atau fitur edit).

**Response (200 OK):**
```json
{
  "produk_id": 3,
  "nama_produk": "Dimsum Mentai Jumbo 5pcs",
  "harga_satuan": 22000,
  "stok_tersedia": 18,
  "stok_minimum": 10
}
```
**Response (404 Not Found):**
```json
{
  "error": "Produk dengan ID tersebut tidak ditemukan"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Terjadi kesalahan pada server"
}
```

## 3. Transaksi Penjualan

### 3.1 Menambahkan Transaksi 
**Endpoint**:
`POST /api/transaksi`

**Headers:**
Authorization: Bearer <token>

**Deskripsi:**
Mencatat transaksi baru dan otomatis mengurangi stok produk. 

**Request Body:**
```json
{
  "user_id": 2,
  "total_harga": 28000,
  "detail": [
    {"produk_id": 1, "jumlah": 2, "harga_satuan": 14000},
    {"produk_id": 3, "jumlah": 1, "harga_satuan": 14000}
  ]
}
```

**Response (201 Created):**
```json
{
  "message": "Transaksi berhasil dicatat",
  "transaksi_id": 7
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Data transaksi tidak valid"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Terjadi kesalahan saat mencatat transaksi"
}
```

### 3.2 Melihat Semua Transaksi 
**Endpoint**:
`GET /api/transaksi`

**Headers:**
Authorization: Bearer <token>

**Deskripsi:**
Mengambil semua transaksi yang telah dilakukan. 

**Response (200 OK):**
```json
[
  {
    "transaksi_id": 1,
    "tanggal": "2025-10-30",
    "total_harga": 24000,
    "user_id": 2
  }
]
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Terjadi kesalahan pada server"
}
```

### 3.3 Melihat Detail Transaksi
**Endpoint:**
`GET /api/transaksi/:id`

**Headers:**
Authorization: Bearer <token>

**Deskripsi:**
Menampilkan detail transaksi tertentu berdasarkan ID transaksi (Digunakan untuk fitur "Riwayat Transaksi" atau detail laporan).

**Response (200 OK):**
```json
{
  "transaksi_id": 5,
  "user_id": 2,
  "tanggal_waktu": "2025-10-31 09:10:00",
  "total_harga": 28000,
  "metode_pembayaran": "tunai",
  "detail": [
    {
      "produk_id": 1,
      "nama_produk": "Dimsum Ori 4pcs",
      "jumlah": 1,
      "subtotal": 14000
    },
    {
      "produk_id": 3,
      "nama_produk": "Dimsum Mentai 5pcs",
      "jumlah": 1,
      "subtotal": 14000
    }
  ]
}
```

**Response (404 Not Found):**
```json
{
  "error": "Transaksi dengan ID tersebut tidak ditemukan"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Terjadi kesalahan pada server"
}
```

## Laporan Penjualan dan Keuangan

### 4.1 Laporan Harian
**Endpoint**:
`GET /api/laporan/harian`

**Headers:**
Authorization: Bearer <token>

**Deskripsi:**
Menampilkan laporan penjualan harian.

**Response (200 OK):**
```json
{
  "tanggal": "2025-10-31",
  "total_transaksi": 12,
  "total_pendapatan": 250000
}
```

**Response (404 Not Found):**
```json
{
  "error": "Tidak ada data laporan untuk periode ini"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Terjadi kesalahan pada server"
}
```

### 4.2 Laporan Bulanan
**Endpoint:**
`GET /api/laporan/bulanan`

**Headers:**
Authorization: Bearer <token>

**Deskripsi:**
Menampilkan ringkasan pendapatan dan jumlah transaksi per bulan.

**Response (200 OK):**
```json
{
  "bulan": "Oktober 2025",
  "total_transaksi": 126,
  "total_pendapatan": 2750000
}
```

**Response (404 Not Found):**
```json
{
  "error": "Tidak ada data laporan untuk periode ini"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Terjadi kesalahan pada server"
}
```

## Log Aktivitas Stok

### 5.1 Mendapatakan Semua Log Stok
**Endpoint:**
`GET /api/stok-log`

**Headers:**
Authorization: Bearer <token>

**Deskripsi:**
Menampilkan riwayat perubahan stok.

**Response (200 OK):**
```json
[
  {
    "log_id": 1,
    "produk_id": 3,
    "user_id": 2,
    "tipe_aktivitas": "masuk",
    "jumlah_perubahan": -2,
    "stok_sebelum": 20,
    "stok_akhir": 18,
    "tanggal_waktu": "2025-10-30 10:05:00"
  }
]
```

**Response (404 Not Found):**
```json
{
  "error": "Tidak ada log stok ditemukan"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Terjadi kesalahan pada server"
}
```

### 5.2 Notifikasi Stok Menipis
**Endpoint:**
`GET /api/stok-log/notifikasi`

**Headers:**
Authorization: Bearer <token>

**Deskripsi:**
Menampilkan produk yang stoknya di bawah batas minimum. 

**Response (200 OK):**
```json
[
  {
    "produk_id": 5,
    "nama_produk": "Dimsum Mini 10pcs",
    "stok_tersedia": 8,
    "stok_minimum": 10
  }
]
```

**Response (200 OK - Kosong):**
```json
[]
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Terjadi kesalahan pada server"
}
```

## Manajemen Pengguna 

### 6.1 Mendapatkan Semua Pengguna
**Endpoint:** 
`GET /api/user`

**Headers:**
Authorization: Bearer <token>

**Deskripsi:**
Hanya bisa diakases oleh admin untuk melihat seluruh akun pengguna. 

**Response (200 OK):**
```json
[
  {
    "user_id": 1,
    "nama": "Owner Zona Bakaran",
    "username": "admin",
    "role": "admin"
  },
  {
    "user_id": 2,
    "nama": "Karyawan 1",
    "username": "karyawan1",
    "role": "karyawan"
  }
]
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Terjadi kesalahan pada server"
}
```

### 6.2 Menambahkan Pengguna Baru 
**Endpoint:**
`POST /api/user`

**Headers:**
Authorization: Bearer <token>

**Deskripsi:**
Menambahkan pengguna baru (karyawan baru).

**Request Body:**
```json
{
  "nama": "Karyawan 7",
  "username": "karyawan7",
  "password": "password098",
  "role": "karyawan"
}
```

**Response (201 Created):**
```json
{
  "message": "User baru berhasil ditambahkan"
}
```

**Response (400 Bad Request):**
```json
{
  "message": "Data user tidak lengkap"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Terjadi kesalahan pada server"
}
```

## 7. Error Global 
**Catatan:** Struktur error ini dapat muncul di seluruh endpoint jika terjadi kesalahan autentikasi, data, atau server. 
```json
[
  {"error": "Token tidak valid"},
  {"error": "Data tidak ditemukan"},
  {"error": "Server sedang tidak dapat diakses"},
  {"error": "Token tidak valid atau telah kedaluwarsa"}
]
```

## Versi
v1.0.0 - Update: 8 November 2025
Dibuat oleh: System Analyst

## Note:
Dokumentasi ini akan diperbarui jika terdapat perubahan pada struktur database, endpoint API, atau penambahan fitur baru. 
