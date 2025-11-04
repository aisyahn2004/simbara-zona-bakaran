import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/db.js";
import authRoutes from "./routes/authroutes.js";
import transactionRoutes from "./routes/transaksiroutes.js";
import stokRoutes from "./routes/stokroutes.js";
import laporanRoutes from "./routes/laporanroutes.js";
import laporanKeuanganRoutes from "./routes/laporankeuanganroutes.js";
import pengeluaranRoutes from './routes/pengeluaranRoutes.js';
import dashboardRoutes from './routes/dashboardroutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Tes koneksi ke database
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("Connected to MySQL database");
    conn.release();
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
})();

app.use("/api/auth", authRoutes);
app.use("/api/transaksi", transactionRoutes);
app.use("/api/admin", stokRoutes);
app.use("/api/admin", laporanRoutes);
app.use("/api", laporanRoutes);
app.use("/api", laporanKeuanganRoutes);
app.use("/api/pengeluaran", pengeluaranRoutes);
app.use("/api/dashboard", dashboardRoutes);


app.get("/", (req, res) => {
  res.send("Zona Bakaran API is running");
});

app.listen(process.env.PORT || 9000, () => {
  console.log(`Server running on port ${process.env.PORT || 9000}`);
});
