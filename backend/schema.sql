CREATE DATABASE IF NOT EXISTS zona_bakaran CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci; USE zona_bakaran;

CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY, 
    nama VARCHAR(100) NOT NULL, 
    role ENUM('admin', 'karyawan') NOT NULL, 
    username VARCHAR(50) UNIQUE NOT NULL, 
    password_hash VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE produk (
    produk_id INT AUTO_INCREMENT PRIMARY KEY, 
    user_id INT, 
    nama_produk VARCHAR(100) NOT NULL, 
    harga_satuan DECIMAL(10,2) NOT NULL, 
    stok_tersedia INT DEFAULT 0, 
    stok_minimum INT DEFAULT 0, 
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE transaksi (
    transaksi_id INT AUTO_INCREMENT PRIMARY KEY, 
    user_id INT NOT NULL, 
    tanggal_waktu DATETIME NOT NULL, 
    total_harga DECIMAL (10,2) NOT NULL, 
    metode_pembayaran ENUM('tunai', 'qris') NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE detail_transaksi (
    detail_id INT AUTO_INCREMENT PRIMARY KEY, 
    transaksi_id INT NOT NULL, 
    produk_id INT NOT NULL, 
    jumlah INT NOT NULL, 
    subtotal DECIMAL (10,2) NOT NULL, 
    FOREIGN KEY (transaksi_id) REFERENCES transaksi(transaksi_id) ON DELETE CASCADE ON UPDATE CASCADE, 
    FOREIGN KEY (produk_id) REFERENCES produk(produk_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE stok_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY, 
    produk_id INT NOT NULL, 
    user_id INT NOT NULL, 
    tipe_aktivitas ENUM('masuk', 'keluar') NOT NULL, 
    jumlah_perubahan INT NOT NULL, 
    stok_sebelum INT NOT NULL, 
    stok_akhir INT NOT NULL, 
    tanggal_waktu DATETIME NOT NULL, 
    FOREIGN KEY (produk_id) REFERENCES produk(produk_id) ON DELETE CASCADE ON UPDATE CASCADE, 
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE pengeluaran (
    pengeluaran_id INT AUTO_INCREMENT PRIMARY KEY, 
    user_id INT NOT NULL, 
    kategori VARCHAR(50) NOT NULL, 
    deskripsi TEXT, 
    jumlah DECIMAL (10,2) NOT NULL, 
    tanggal DATE NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;