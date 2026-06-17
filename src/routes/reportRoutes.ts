import { Router } from 'express';
import {
  getTransactionReportPdf,
  getTransactionReportExcel,
  getVolumeStats,
  getLoanStats
} from '../controllers/reportController';

const router = Router();

// Rapports PDF et Excel
router.post('/transactions', getTransactionReportPdf);
router.post('/transactions/excel', getTransactionReportExcel);

// Statistiques
router.get('/stats/volume', getVolumeStats);
router.get('/stats/loans', getLoanStats);

export default router;
