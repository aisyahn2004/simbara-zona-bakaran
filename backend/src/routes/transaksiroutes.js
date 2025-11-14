import express from "express";
import { createTransaction, getAlltrasaksi, getTransactionById } from "../handler/transaksihandler.js";
import { verifyAdmin, verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createTransaction);
router.get("/all", verifyToken, verifyAdmin, getAlltrasaksi);
router.get("/:id", verifyToken, verifyAdmin, getTransactionById);

export default router;
