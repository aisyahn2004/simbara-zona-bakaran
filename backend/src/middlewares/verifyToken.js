import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware untuk verifikasi token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Pastikan header Authorization ada dan formatnya benar
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan atau tidak valid" });
  }

  const token = authHeader.split(" ")[1]; // format: "Bearer <token>"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // simpan payload token ke req.user
    next(); // lanjut ke route berikutnya
  } catch (err) {
    return res.status(403).json({ message: "Token tidak valid atau kadaluarsa" });
  }
};

// Middleware untuk verifikasi admin
export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak, hanya admin yang dapat melakukan aksi ini" });
  }
  next();
};
