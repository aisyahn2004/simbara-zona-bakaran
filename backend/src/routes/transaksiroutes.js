import express from "express";
import { createTransaction, getAlltransaksi, getTransactionById, getDetailHarian } from "../handler/transaksihandler.js";
import { verifyAdmin, verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createTransaction);
router.get("/all", verifyToken, verifyAdmin, getAlltransaksi);
router.get("/harian", verifyToken, verifyAdmin, getDetailHarian);
router.get("/:id", verifyToken, verifyAdmin, getTransactionById);

export default router;
