import puppeteer from 'puppeteer';

export const generateTransactionPDF = async (from: string, to: string): Promise<Buffer> => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Simulate report generation
    await page.setContent(`<h1>Transaction Report</h1><p>From: ${from} To: ${to}</p>`);
    const pdf = await page.pdf({ format: 'A4' });
    
    await browser.close();
    return Buffer.from(pdf);
};
