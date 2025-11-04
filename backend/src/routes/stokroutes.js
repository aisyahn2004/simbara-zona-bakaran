import express from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getSalesReport,
  getExpenseReport
} from "../handler/stokhandler.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Semua route ini hanya bisa diakses admin
router.post("/produk", verifyToken, addProduct);
router.put("/produk/:id", verifyToken, updateProduct);
router.delete("/produk/:id", verifyToken, deleteProduct);
router.get("/produk/stok-menipis", verifyToken, getLowStockProducts);

router.get("/laporan/penjualan", verifyToken, getSalesReport);
router.get("/laporan/pengeluaran", verifyToken, getExpenseReport);

export default router;
