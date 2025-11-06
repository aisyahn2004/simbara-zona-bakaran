USE zona_bakaran;

INSERT INTO user (nama, role, username, password_hash) VALUES
('Owner Zona Bakaran', 'admin', 'owner', 'hashed_pw1'),
('Maura Aqlaila', 'karyawan', 'maura', 'hashed_pw2'),
('Aisyah Nurhayati', 'karyawan', 'aisyah', 'hashed_pw3'),
('Widda Aulia', 'karyawan', 'widda', 'hashed_pw4'),
('Anggun Chintamy', 'karyawan', 'anggun', 'hashed_pw5'),
('Hasna Nailah', 'karyawan', 'hasna', 'hashed_pw6');

INSERT INTO produk (user_id, nama_produk, harga_satuan, stok_tersedia, stok_minimum) VALUES
(2, 'Dimsum Mentai Jumbo 4pcs', 16000, 30, 5),
(3, 'Dimsum Mentai Jumbo 5pcs', 20000, 25, 5),
(4, 'Dimsum Mentai Jumbo 6pcs', 24000, 20, 5),
(5, 'Dimsum Mini 6pcs', 18000, 30, 5),
(6, 'Dimsum Mini 8pcs', 24000, 25, 5),
(2, 'Dimsum Mini 10pcs', 28000, 20, 5),
(3, 'Dimsum Kukus Jumbo 3pcs', 9000, 40, 5),
(5, 'Dimsum Kukus Jumbo 4pcs', 12000, 35, 5),
(3, 'Dimsum Kukus Jumbo 5pcs', 15000, 30, 5),
(2, 'Dimsum Kukus Mini 5pcs', 10000, 45, 5),
(4, 'Dimsum Kukus Mini 10pcs', 20000, 40, 5),
(3, 'Dimsum Bakar 3pcs', 10000, 30, 5),
(5, 'Dimsum Bakar 6pcs', 20000, 25, 5),
(4, 'Dakkochi 1pcs', 5000, 50, 10),
(6, 'Extra Chilioil', 1000, 100, 20);

INSERT INTO transaksi (user_id, tanggal_waktu, total_harga, metode_pembayaran) VALUES
(2, '2025-10-30 10:00:00', 48000, 'tunai'),
(3, '2025-10-30 11:30:00', 30000, 'qris'),
(4, '2025-10-31 09:00:00', 25000, 'tunai'),
(5, '2025-10-31 13:15:00', 20000, 'qris'),
(6, '2025-11-01 15:00:00', 36000, 'tunai');

INSERT INTO detail_transaksi (transaksi_id, produk_id, jumlah, subtotal) VALUES
(2, 1, 2, 32000),
(4, 14, 2, 10000),
(3, 15, 1, 1000),
(5, 3, 1, 24000),
(6, 9, 1, 15000),
(2, 13, 1, 20000),
(3, 14, 1, 5000),
(5, 10, 1, 10000),
(4, 12, 1, 10000),
(6, 2, 1, 20000),
(5, 4, 1, 18000);

INSERT INTO stok_log (produk_id, user_id, tipe_aktivitas, jumlah_perubahan, stok_sebelum, stok_akhir, tanggal_waktu) VALUES
(1, 2, 'masuk', -2, 30, 28, '2025-10-30 10:05:00'),
(14, 2, 'keluar', -2, 50, 48, '2025-10-30 10:05:00'),
(3, 3, 'keluar', -1, 20, 19, '2025-10-30 11:35:00'),
(13, 4, 'masuk', -1, 25, 24, '2025-10-31 09:10:00'),
(10, 5, 'keluar', -1, 45, 44, '2025-10-31 13:20:00');

INSERT INTO pengeluaran (user_id, kategori, deskripsi, jumlah, tanggal) VALUES
(1, 'Bahan Baku', 'Beli 2 kotak dimsum ori', 200000, '2025-10-27'),
(1, 'Bahan Tambahan', 'Beli saus mentai dan chilioil', 80000, '2025-10-28'),
(2, 'Operasional', 'Gas dan listrik dapur', 120000, '2025-10-29'),
(3, 'Kemasan', 'Beli plastik dan stiker logo', 60000, '2025-10-29'),
(4, 'Perlengkapan', 'Beli tusuk sate', 30000, '2025-10-30');
