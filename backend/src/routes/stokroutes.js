import express from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getSalesReport,
  getExpenseReport
} from "../handler/stokhandler.js";
import { verifyToken, verifyAdmin } from "../middlewares/verifyToken.js";

const router = express.Router();

// Semua route ini hanya bisa diakses admin
router.post("/produk", verifyToken, verifyAdmin, addProduct);
router.put("/produk/:id", verifyToken, verifyAdmin, updateProduct);
router.delete("/produk/:id", verifyToken, verifyAdmin, deleteProduct);
router.get("/produk/stokmenipis", verifyToken, verifyAdmin, getLowStockProducts);

router.get("/laporan/penjualan", verifyToken, verifyAdmin, getSalesReport);
router.get("/laporan/pengeluaran", verifyToken, verifyAdmin, getExpenseReport);

export default router;
