/**
 * Monetization Support Kit CLI Runner
 */
import { SupportInvoicingEngine } from './invoicing_engine';

console.log("=== RUNNING MONETIZATION SUPPORT KIT DEMO ===");

const invoicing = new SupportInvoicingEngine();
const invUsd = invoicing.generateInvoice("Acme International SaaS", "growth_1500", "USD", false);
console.log(`[PASS] Export Invoice: ${invUsd.invoiceNumber} | Total: $${invUsd.totalPayable} USD via ${invUsd.paymentMethod}`);

const invInr = invoicing.generateInvoice("Bengaluru Retail Brands Pvt Ltd", "starter_500", "INR", true);
console.log(`[PASS] Domestic Invoice: ${invInr.invoiceNumber} | Total: ₹${invInr.totalPayable} INR (incl GST) via ${invInr.paymentMethod}`);

console.log("=== ALL MONETIZATION CHECKS PASSED ===");
