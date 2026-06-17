import puppeteer from 'puppeteer';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

export const generatePdfReport = async (transactions: any[]): Promise<Buffer> => {
  const templatePath = path.join(__dirname, '../reports/templates/transactionReport.html');
  let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

  // Simple template substitution
  const rows = transactions.map(t => `
    <tr>
      <td>${t.id}</td>
      <td>${t.date}</td>
      <td>${t.type}</td>
      <td>${t.amount} ${t.currency}</td>
      <td>${t.status}</td>
    </tr>
  `).join('');

  htmlTemplate = htmlTemplate.replace('{{transactions}}', rows);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  
  await browser.close();
  
  return Buffer.from(pdfBuffer);
};

export const generateExcelReport = async (transactions: any[]): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Transactions');

  sheet.columns = [
    { header: 'ID', key: 'id', width: 25 },
    { header: 'Date', key: 'date', width: 20 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Currency', key: 'currency', width: 10 },
    { header: 'Status', key: 'status', width: 15 },
  ];

  transactions.forEach(t => {
    sheet.addRow(t);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};
