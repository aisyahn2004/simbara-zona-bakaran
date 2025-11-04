import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  addPengeluaran,
  getPengeluaranList,
  getPengeluaranDetail,
  editPengeluaran,
  removePengeluaran,
} from "../controllers/pengeluaranController.js";

const router = express.Router();

// Semua endpoint butuh login admin
router.post("/", verifyToken, addPengeluaran);
router.get("/", verifyToken, getPengeluaranList);
router.get("/:id", verifyToken, getPengeluaranDetail);
router.put("/:id", verifyToken, editPengeluaran);
router.delete("/:id", verifyToken, removePengeluaran);

export default router;
