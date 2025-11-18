import express from "express";
import { getLaporanPenjualan } from "../handler/laporanhandler.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/penjualan", verifyToken, getLaporanPenjualan); // DIUBAH KE "/penjualan"
//router.get("/penjualan", getLaporanPenjualan);
export default router;