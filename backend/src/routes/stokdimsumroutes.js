import express from "express";
import {
  getStock,
  addStock,
  updateStock,
  deleteStock,
} from "../handler/stokdimsum.js";

const router = express.Router();

router.get("/", getStock); // GET all stok
router.post("/", addStock); // POST tambah ukuran/stok
router.put("/:ukuran_id", updateStock); // PUT update stok
router.delete("/:ukuran_id", deleteStock); // DELETE stok/ukuran

export default router;
