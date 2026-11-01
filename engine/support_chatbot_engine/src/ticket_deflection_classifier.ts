/**
 * Ticket Deflection Classifier & Intent Evaluator
 * Evaluates deflection probability, urgency velocity, and escalation routes.
 */

export interface QueryClassification {
  query: string;
  primaryIntent: 'order_status' | 'refund_request' | 'technical_troubleshooting' | 'clinical_triage' | 'billing_inquiry' | 'general_faq';
  deflectionProbability: number; // 0.0 to 1.0
  deflectionStatus: 'deflected_automated' | 'deflected_self_service' | 'escalate_human_agent' | 'urgent_clinical_triage';
  urgencyScore: number; // 1 (low) to 5 (critical)
  sentiment: 'positive' | 'neutral' | 'frustrated' | 'angry';
  confidenceScore: number;
  recommendedEscalationQueue?: string;
}

export class TicketDeflectionClassifier {
  private readonly clinicalKeywords = ['chest pain', 'shortness of breath', 'allergy', 'anaphylaxis', 'fever', 'dosage', 'emergency', 'prescription'];
  private readonly angryKeywords = ['lawyer', 'legal', 'scam', 'fraud', 'steal', 'horrible', 'unacceptable', 'manager', 'ceo'];
  private readonly highUrgencyKeywords = ['immediately', 'asap', 'broken', 'lost', 'damaged', 'failed', 'urgent'];

  public classify(query: string, similarityConfidence: number = 0.85): QueryClassification {
    const lower = query.toLowerCase();

    // 1. Clinical / Emergency Triage Detection
    const hasClinical = this.clinicalKeywords.some(kw => lower.includes(kw));
    if (hasClinical) {
      return {
        query,
        primaryIntent: 'clinical_triage',
        deflectionProbability: 0.0,
        deflectionStatus: 'urgent_clinical_triage',
        urgencyScore: 5,
        sentiment: 'neutral',
        confidenceScore: 0.99,
        recommendedEscalationQueue: 'licensed_medical_triage_team'
      };
    }

    // 2. High Frustration / Legal Escalate
    const isAngry = this.angryKeywords.some(kw => lower.includes(kw));
    if (isAngry) {
      return {
        query,
        primaryIntent: 'refund_request',
        deflectionProbability: 0.15,
        deflectionStatus: 'escalate_human_agent',
        urgencyScore: 4,
        sentiment: 'angry',
        confidenceScore: 0.92,
        recommendedEscalationQueue: 'tier_2_customer_relations_desk'
      };
    }

    // 3. Determine Primary Intent
    let primaryIntent: QueryClassification['primaryIntent'] = 'general_faq';
    let urgency = 2;

    if (lower.includes('where is my order') || lower.includes('track') || lower.includes('shipping') || lower.includes('delivery')) {
      primaryIntent = 'order_status';
      urgency = 2;
    } else if (lower.includes('refund') || lower.includes('return') || lower.includes('exchange') || lower.includes('money back')) {
      primaryIntent = 'refund_request';
      urgency = 3;
    } else if (lower.includes('setup') || lower.includes('error') || lower.includes('api') || lower.includes('connect') || lower.includes('bug')) {
      primaryIntent = 'technical_troubleshooting';
      urgency = 3;
    } else if (lower.includes('invoice') || lower.includes('charge') || lower.includes('billing') || lower.includes('gst')) {
      primaryIntent = 'billing_inquiry';
      urgency = 3;
    }

    if (this.highUrgencyKeywords.some(kw => lower.includes(kw))) {
      urgency = Math.min(5, urgency + 1);
    }

    // 4. Calculate Deflection Probability
    let baseDeflection = 0.50;
    if (primaryIntent === 'order_status') baseDeflection = 0.88;
    else if (primaryIntent === 'general_faq') baseDeflection = 0.82;
    else if (primaryIntent === 'refund_request') baseDeflection = 0.65;
    else if (primaryIntent === 'technical_troubleshooting') baseDeflection = 0.60;
    else if (primaryIntent === 'billing_inquiry') baseDeflection = 0.70;

    const finalDeflection = Math.min(0.95, Math.max(0.10, baseDeflection * (similarityConfidence / 0.85)));
    const deflectionProbability = Math.round(finalDeflection * 100) / 100;

    let deflectionStatus: QueryClassification['deflectionStatus'] = 'deflected_automated';
    if (deflectionProbability >= 0.75) {
      deflectionStatus = 'deflected_automated';
    } else if (deflectionProbability >= 0.50) {
      deflectionStatus = 'deflected_self_service';
    } else {
      deflectionStatus = 'escalate_human_agent';
    }

    return {
      query,
      primaryIntent,
      deflectionProbability,
      deflectionStatus,
      urgencyScore: urgency,
      sentiment: urgency >= 4 ? 'frustrated' : 'neutral',
      confidenceScore: Math.round(similarityConfidence * 100) / 100,
      recommendedEscalationQueue: deflectionStatus === 'escalate_human_agent' ? 'tier_1_support_inbox' : undefined
    };
  }
}
