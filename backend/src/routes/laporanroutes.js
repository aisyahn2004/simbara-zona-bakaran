import express from "express";
import { getLaporanPenjualan } from "../handler/laporanhandler.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/laporan", verifyToken, getLaporanPenjualan);

export default router;