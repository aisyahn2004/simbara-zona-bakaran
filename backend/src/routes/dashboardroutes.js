import express from "express";
import { getDashboard, getAktivitasTerbaru } from "../handler/dashboardhandler.js";
import { verifyToken, verifyAdmin } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, verifyAdmin, getDashboard);
router.get("/aktivitas", verifyToken, verifyAdmin, getAktivitasTerbaru);

export default router;