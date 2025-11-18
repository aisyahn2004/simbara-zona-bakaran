import express from "express";
import { 
  getLaporanKeuangan, 
  getLaporanBulanan,
  //getLaporanDetail
} from "../handler/laporankeuanganhandler.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/keuangan", verifyToken, getLaporanKeuangan);
router.get("/bulanan", verifyToken, getLaporanBulanan);
//router.get("/laporandetail", verifyToken, getLaporanDetail);


export default router;