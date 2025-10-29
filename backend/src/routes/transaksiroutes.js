import express from "express";
import { createTransaction } from "../handler/transaksihandler.js";

const router = express.Router();

router.post("/", createTransaction);

export default router;
