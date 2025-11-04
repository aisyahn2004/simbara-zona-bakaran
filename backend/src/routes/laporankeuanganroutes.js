import express from "express";
import { getLaporanKeuangan } from "../handler/laporankeuanganhandler.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/laporankeuangan", verifyToken, getLaporanKeuangan);

export default router;
