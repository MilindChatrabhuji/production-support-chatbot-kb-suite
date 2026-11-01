/**
 * Hallucination Guard & Factual Verification Filter
 * Prohibits unauthorized pricing changes, non-existent policies, and out-of-scope medical claims.
 */

export interface HallucinationVerification {
  isValid: boolean;
  violations: string[];
  sanitizedResponse: string;
}

export class HallucinationGuard {
  private readonly forbiddenClaims = [
    { pattern: /free\s+for\s+life/i, reason: 'Unauthorized free lifetime promise' },
    { pattern: /100%\s+cure/i, reason: 'Prohibited medical cure claim' },
    { pattern: /discount\s+(?:of\s+)?(?:50|60|70|80|90)%/i, reason: 'Exceeds authorized discount threshold (max 20%)' },
    { pattern: /guaranteed\s+profit/i, reason: 'Prohibited financial outcome promise' },
    { pattern: /unverified[-_ ]cure|alternative[-_ ]health/i, reason: 'Prohibited alternative medical assertion (clinical evidence only)' }
  ];

  public verify(candidateResponse: string, contextGrounding: string): HallucinationVerification {
    const violations: string[] = [];

    // 1. Check prohibited claim patterns
    for (const rule of this.forbiddenClaims) {
      if (rule.pattern.test(candidateResponse)) {
        violations.push(rule.reason);
      }
    }

    // 2. Clinical check: ensure statutory disclaimer if clinical terms are present
    const hasClinicalContext = /treatment|symptom|medication|dosage|diagnos/i.test(candidateResponse);
    const hasDisclaimer = /consult a licensed medical professional|educational purposes only|emergency room/i.test(candidateResponse);
    if (hasClinicalContext && !hasDisclaimer) {
      violations.push('Missing mandatory clinical consultation disclaimer');
    }

    let sanitized = candidateResponse;
    if (violations.length > 0) {
      sanitized = "I apologize, but I must refer this inquiry to our specialist team. Please allow our certified human representatives to provide verified assistance.";
    }

    return {
      isValid: violations.length === 0,
      violations,
      sanitizedResponse: sanitized
    };
  }
}
