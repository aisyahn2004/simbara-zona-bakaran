import express from "express";
import { getDashboard, getAktivitasTerbaru } from "../handler/dashboardhandler";
import { verifyToken, verifyAdmin } from "../middlewares/verifyToken";

const router = express.Router();

router.get("/", verifyToken, verifyAdmin, getDashboard);
router.get("/aktivitas", verifyToken, verifyAdmin, getAktivitasTerbaru);

export default router;