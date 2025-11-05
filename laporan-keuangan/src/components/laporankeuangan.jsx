import React from "react";

export default function LaporanKeuangan() {
  return (
    <div className="flex bg-[#F5F2E9] min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-[#7A0A0A] text-white p-6 space-y-6">
        <h1 className="text-2xl font-bold">ZonaBakaran</h1>
        <nav className="space-y-4">
          <a className="block p-2 rounded hover:bg-[#A31616]" href="#">Beranda</a>
          <a className="block p-2 rounded hover:bg-[#A31616]" href="#">Laporan Penjualan</a>
          <a className="block p-2 bg-[#A31616] rounded" href="#">Laporan Keuangan</a>
          <a className="block p-2 rounded hover:bg-[#A31616]" href="#">Produk & Stok</a>
          <a className="block p-2 rounded hover:bg-[#A31616]" href="#">Pengaturan</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#7A0A0A]">Laporan Keuangan</h2>
          <button className="bg-[#E8B200] text-white px-4 py-2 rounded">Logout</button>
        </div>

        <p className="text-gray-700 mb-6">Kelola dan pantau seluruh aktivitas keuangan ZonaBakaran</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 shadow rounded border-t-4 border-yellow-400">
            <h3 className="text-gray-700">Total Pendapatan</h3>
            <p className="text-2xl font-bold text-[#7A0A0A]">Rp 12.000.000</p>
          </div>

          <div className="bg-white p-6 shadow rounded border-t-4 border-red-500">
            <h3 className="text-gray-700">Total Pengeluaran</h3>
            <p className="text-2xl font-bold text-red-600">Rp 7.500.000</p>
          </div>

          <div className="bg-white p-6 shadow rounded border-t-4 border-green-500">
            <h3 className="text-gray-700">Laba / Rugi</h3>
            <p className="text-2xl font-bold text-green-600">Rp 4.500.000</p>
          </div>

          <div className="bg-white p-6 shadow rounded border-t-4 border-blue-500">
            <h3 className="text-gray-700">Pengeluaran Terbesar</h3>
            <p className="text-xl font-semibold">Bahan Baku</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700">Dari</label>
              <input type="date" className="w-full border p-2 rounded mt-1" />
            </div>

            <div>
              <label className="block text-gray-700">Sampai</label>
              <input type="date" className="w-full border p-2 rounded mt-1" />
            </div>

            <div>
              <label className="block text-gray-700">Jenis Transaksi</label>
              <select className="w-full border p-2 rounded mt-1">
                <option>Semua</option>
                <option>Pendapatan</option>
                <option>Pengeluaran</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3">Tanggal</th>
                <th className="p-3">Keterangan</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Jenis</th>
                <th className="p-3">Jumlah</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-3">27 Okt 2025</td>
                <td className="p-3">Pembelian Bahan Ayam</td>
                <td className="p-3">Bahan Baku</td>
                <td className="p-3 text-red-600 font-semibold">Pengeluaran</td>
                <td className="p-3">Rp 300.000</td>
                <td className="p-3 text-blue-500 cursor-pointer">Detail</td>
              </tr>

              <tr className="border-b">
                <td className="p-3">27 Okt 2025</td>
                <td className="p-3">Penjualan Dimsum Mentai</td>
                <td className="p-3">Penjualan</td>
                <td className="p-3 text-green-600 font-semibold">Pendapatan</td>
                <td className="p-3">Rp 20.000</td>
                <td className="p-3 text-blue-500 cursor-pointer">Detail</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
