import express from "express";
import { createTransaction } from "../handler/transaksihandler.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createTransaction);

export default router;
