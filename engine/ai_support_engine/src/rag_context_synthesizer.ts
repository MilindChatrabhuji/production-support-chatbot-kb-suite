/**
 * RAG Context & Prompt Synthesizer
 * Merges retrieved knowledge chunks with system persona guardrails.
 */

import { RetrievalResult } from './knowledge_base_embedder';

export interface PromptPayload {
  systemPrompt: string;
  contextBlock: string;
  userPrompt: string;
}

export class RagContextSynthesizer {
  public synthesize(query: string, results: RetrievalResult[], brandName: string = "Nexus Support"): PromptPayload {
    const systemPrompt = `You are the verified AI customer support specialist for ${brandName}.
Answer inquiries strictly using the verified Knowledge Base fragments provided below.
Rules:
1. Do not invent pricing, shipping windows, or return policies not explicitly stated in context.
2. For medical or health triage questions, always provide supportive guidance and mandate immediate consultation with certified clinicians.
3. Be concise, polite, professional, and reference citation sources when available.`;

    const contextSnippets = results.map(r => `[Source: ${r.chunk.title} | Chunk: ${r.chunk.chunkId}]
${r.chunk.text}`).join('\n\n');

    return {
      systemPrompt,
      contextBlock: contextSnippets.length > 0 ? contextSnippets : "No verified knowledge base match found. Prompt human escalation.",
      userPrompt: query
    };
  }
}
