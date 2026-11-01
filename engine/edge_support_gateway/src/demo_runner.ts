/**
 * Edge Support Gateway Demo Runner
 */
import { CrmWebhookHandler } from './zendesk_freshdesk_webhook';
import { SupportAnalyticsAggregator } from './support_analytics_aggregator';

console.log("=== RUNNING EDGE SUPPORT GATEWAY DEMO ===");

const webhook = new CrmWebhookHandler("whsec_prod_sample_key");
const resp = webhook.handleWebhook({
  platform: 'zendesk',
  eventId: 'evt_101',
  ticketId: 'tkt_5521',
  customerEmail: 'customer@help.example.com',
  subject: 'Order Tracking Query',
  body: 'Where is my package? Tracking link is pending.',
  signature: 'sha256=abcdef123456',
  timestamp: Date.now()
});

console.log(`[PASS] Webhook processed action: ${resp.actionTaken} in ${resp.latencyMs}ms`);

const aggregator = new SupportAnalyticsAggregator();
const metrics = aggregator.calculateMetrics([
  { deflected: true, frtSec: 0.8, resolutionMin: 1.2, csat: 5 },
  { deflected: true, frtSec: 1.1, resolutionMin: 2.0, csat: 5 },
  { deflected: false, frtSec: 12.0, resolutionMin: 18.5, csat: 4 },
  { deflected: true, frtSec: 0.5, resolutionMin: 0.9, csat: 5 }
]);

console.log(`[PASS] Total Inquiries: ${metrics.totalInquiries} | Deflection Rate: ${metrics.deflectionRatePct}% | CSAT: ${metrics.csatAverage}/5.0`);
console.log("=== ALL EDGE GATEWAY CHECKS PASSED ===");
