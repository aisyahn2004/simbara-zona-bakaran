import db from "../config/db.js";
import { hashPassword, comparePassword } from "../middlewares/hashPassword.js";
import jwt from "jsonwebtoken";
import Joi from "joi";
import dotenv from "dotenv";

dotenv.config();
console.log("JWT_SECRET =", process.env.JWT_SECRET);

// REGISTER
export const register = async (req, res) => {
  const { nama, role, username, password } = req.body;

  // Validasi input
  const schema = Joi.object({
    nama: Joi.string().min(3).required(),
    role: Joi.string().valid("admin", "karyawan").required(),
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const [existingUser] = await db.query("SELECT * FROM user WHERE username = ?", [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    const hashedPassword = await hashPassword(password);
    await db.query(
      "INSERT INTO user (nama, role, username, password_hash) VALUES (?, ?, ?, ?)",
      [nama, role, username, hashedPassword]
    );

    res.status(201).json({ message: "Registrasi berhasil" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [userResult] = await db.query("SELECT * FROM user WHERE username = ?", [username]);
    const user = userResult[0];

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: "Password salah" });
    }

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, nama: user.nama },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Response berbeda tergantung role
   if (user.role === "admin") {
  res.json({
    message: "Login berhasil sebagai admin",
    redirect: "/adminowner/berandaa.html",
    token,
  });
} else {
  res.json({
    message: "Login berhasil sebagai karyawan",
    redirect: "/frontend/karyawan/beranda.html",
    token,
  });
}

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
