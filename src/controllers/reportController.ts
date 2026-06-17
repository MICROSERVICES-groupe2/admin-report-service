import { Request, Response } from 'express';
import { generatePdfReport, generateExcelReport } from '../services/reportGenerator';
import { fetchTransactions, fetchTransactionStats, fetchLoanStats } from '../services/httpClient';

export const getTransactionReportPdf = async (req: Request, res: Response) => {
  try {
    const filters = req.body;
    const transactions = await fetchTransactions(filters);
    const pdfBuffer = await generatePdfReport(transactions);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate PDF report' });
  }
};

export const getTransactionReportExcel = async (req: Request, res: Response) => {
  try {
    const filters = req.body;
    const transactions = await fetchTransactions(filters);
    const excelBuffer = await generateExcelReport(transactions);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.xlsx"');
    res.send(excelBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate Excel report' });
  }
};

export const getVolumeStats = async (req: Request, res: Response) => {
  try {
    const stats = await fetchTransactionStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch volume stats' });
  }
};

export const getLoanStats = async (req: Request, res: Response) => {
  try {
    const stats = await fetchLoanStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch loan stats' });
  }
};
