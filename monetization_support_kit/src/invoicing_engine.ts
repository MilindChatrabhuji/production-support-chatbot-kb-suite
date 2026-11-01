/**
 * Dual-Currency Support Retainer Invoicing Engine
 * Handles USD and INR billing, GST calculation, and LUT zero-rated exports.
 */

export interface InvoiceItem {
  description: string;
  amount: number;
  currency: 'USD' | 'INR';
}

export interface ClientInvoice {
  invoiceNumber: string;
  clientName: string;
  tier: 'starter_500' | 'growth_1500' | 'enterprise_3000';
  currency: 'USD' | 'INR';
  baseAmount: number;
  taxAmount: number; // 0 for export under LUT, 18% for domestic INR
  totalPayable: number;
  paymentMethod: 'UPI' | 'PayPal';
  remittanceDetails: string;
  generatedDate: string;
}

export class SupportInvoicingEngine {
  private readonly domesticGstRate = 0.18; // 18% GST for India domestic
  private readonly upiHandle = "milind.chatrabhuji@okhdfcbank";
  private readonly payPalHandle = "milind.chatrabhuji@gmail.com";

  public generateInvoice(
    clientName: string,
    tier: 'starter_500' | 'growth_1500' | 'enterprise_3000',
    currency: 'USD' | 'INR',
    isDomesticIndia: boolean = false
  ): ClientInvoice {
    let baseAmount = 500;
    if (tier === 'growth_1500') baseAmount = 1500;
    if (tier === 'enterprise_3000') baseAmount = 3000;

    if (currency === 'INR') {
      baseAmount = baseAmount * 84; // Approx conversion
    }

    const taxAmount = isDomesticIndia ? Math.round(baseAmount * this.domesticGstRate) : 0;
    const totalPayable = baseAmount + taxAmount;

    return {
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      clientName,
      tier,
      currency,
      baseAmount,
      taxAmount,
      totalPayable,
      paymentMethod: isDomesticIndia ? 'UPI' : 'PayPal',
      remittanceDetails: isDomesticIndia ? `Direct Bank UPI: ${this.upiHandle}` : `PayPal Global: ${this.payPalHandle}`,
      generatedDate: new Date().toISOString()
    };
  }
}
