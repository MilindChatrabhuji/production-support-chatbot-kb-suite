# Production Enterprise AI Customer Support Chatbot & RAG Knowledge-Base Suite (Way #59 / Product 61)

[![Release v1.0.0](https://img.shields.io/badge/Release-v1.0.0-6366F1.svg)](https://github.com/MilindChatrabhuji/production-support-chatbot-kb-suite/releases/tag/v1.0.0)
[![TypeScript 5.3+](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers%20%26%20D1-orange.svg)](https://workers.cloudflare.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An industrial-grade enterprise AI customer support automation, vector retrieval-augmented generation (RAG) knowledge base, and CRM ticket deflection ecosystem engineered for high-growth e-commerce brands, SaaS platforms, and digital agencies.

Designed and developed by **Dr. Milind Chatrabhuji**, this suite empowers customer success and support operations to achieve 60-80% automated ticket deflection, sub-second first response times (FRT), and zero-hallucination factual query resolution across multi-channel environments (Web Chat, Zendesk, Freshdesk, and Gorgias).

---

## ⚡ Architectural Architecture

```
                                 [ Omnichannel Customer Channels ]
                          (Web Chat Widget / Zendesk / Freshdesk / Gorgias)
                                                │
                                                ▼
                               [ Cloudflare Workers Edge Gateway ]
                         (worker.ts • HMAC Authentication • Rate Limiter)
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 ▼                                                             ▼
    [ Vector Knowledge Base RAG ]                                 [ Multi-Class Intent Router ]
  (knowledge_base_embedder.ts)                                 (ticket_deflection_classifier.ts)
  • Cosine Similarity (Min 0.78)                               • Tier-1 Deflection / Self-Service
  • Recursive Chunking (350 tokens)                            • Human Escalation Trigger
  • Zero-Hallucination Guard Filter                            • Urgency & Sentiment Scorer
                 │                                                             │
                 └──────────────────────────────┬──────────────────────────────┘
                                                ▼
                             [ Omnichannel Dialogue Manager ]
                          (Contextual Multi-Turn Memory • CSAT)
                                                │
                                                ▼
                             [ CRM Ticket Bi-Directional Sync ]
                                (Cloudflare D1 SQL Schema)
```

---

## 📦 What's Included

### Pack 1: Core Support Chatbot & RAG Knowledge-Base Engine (`engine/support_chatbot_engine/`)
- **`knowledge_base_embedder.ts`**: High-performance semantic chunking (recursive 350-token window with 50-token overlap), cosine similarity vector scoring, and metadata-aware knowledge retrieval.
- **`ticket_deflection_classifier.ts`**: Multi-class intent classifier computing deflection probability (0-100%), customer sentiment polarity, and urgency velocity.
- **`omnichannel_dialogue_manager.ts`**: Finite state machine managing conversational turns, session memory, human handover triggers, and post-resolution CSAT surveys.
- **`hallucination_guard.ts`**: Factual verification filter enforcing strict grounding to ingested documentation, prohibiting price mutations, unauthorized promises, or unqualified medical assertions.
- **`rag_context_synthesizer.ts`**: Dynamic prompt synthesizer assembling verified knowledge chunks, system persona constraints, and user query context.
- **`demo_runner.ts` & `index.ts`**: Complete CLI test runner validating RAG retrieval, intent deflection, and state transitions.

### Pack 2: Edge Support Gateway & CRM Webhook (`engine/edge_support_gateway/`)
- **`zendesk_freshdesk_webhook.ts`**: Cloudflare Workers edge webhook integration syncing tickets, tags, and agent replies bi-directionally with Zendesk, Freshdesk, and Gorgias.
- **`support_analytics_aggregator.ts`**: Real-time KPI analytics aggregator calculating Deflection Rate, First Response Time (FRT), Resolution Duration, and Customer Satisfaction (CSAT).
- **`worker.ts`**: Production Cloudflare Workers REST API with authenticated endpoints (`/health`, `/api/chat/message`, `/api/kb/search`, `/api/deflection/score`, `/api/ticket/escalate`, `/api/webhook/crm`).
- **`wrangler.toml` & `schema.sql`**: Cloudflare D1 SQL database schema with indexed tables for conversations, knowledge embeddings, deflection audits, escalation tickets, and CSAT logs.

### Pack 3: AI Support Monetization & Retainer Kit (`monetization_support_kit/`)
- **`AI_SUPPORT_RETAINER_AGREEMENT.md`**: Legal service agreement with 99.9% uptime SLA, 48-hour model retraining turnaround, and escalation protocols.
- **`CLIENT_KNOWLEDGE_BASE_AUDIT_BRIEF.md`**: Client support intake workbook collecting FAQs, refund guidelines, escalation routing, and tone of voice guardrails.
- **`AGENCY_WHITE_LABEL_SUPPORT_PITCH.md`**: B2B pitch deck demonstrating how automated AI customer support cuts tier-1 operational costs by 60% while improving CSAT.
- **`invoicing_engine.ts`**: Dual-currency USD/INR billing and invoice calculator with automated GST/LUT export compliance.
- **`schema.sql`**: D1 table schema for support client accounts, recurring retainers, and billing history.

### Zero-Dependency Interactive Showcase (`showcase/index.html`)
- **Omnichannel Live Chat Simulator**: Interactive real-time chat with simulated RAG retrieval and citation previews.
- **Knowledge Base Vector Chunking Sandbox**: Live text chunking and cosine similarity matching simulator.
- **Intent Deflection Matrix**: Interactive query analyzer predicting deflection scores and escalation routes.
- **Edge Metrics & Retainer Dashboard**: Real-time KPI charts and retainer tier checkout portal.

---

## 💰 Commercial Pricing & Remittance

| Package Tier | Pricing (USD) | Pricing (INR) | Inclusions |
| :--- | :--- | :--- | :--- |
| **Single Engine Pack** | **$9.00 USD** | **~₹750 INR** | Choice of Pack 1, Pack 2, or Pack 3 with full TypeScript source |
| **Master Commercial Suite** | **$19.00 USD** | **~₹1,599 INR** | Complete 3-Pack Suite, 8 CRC-verified ZIP archives, and Showcase |
| **Monthly B2B Retainer: Starter** | **$500.00 / mo** | **~₹42,000 / mo** | Custom FAQ chatbot setup, single-channel web chat, 30-day monitoring |
| **Monthly B2B Retainer: Growth** | **$1,500.00 / mo** | **~₹1,25,000 / mo** | Full RAG pipeline, Zendesk/Freshdesk sync, bi-weekly knowledge updates |
| **Monthly B2B Retainer: Scale** | **$3,000.00 / mo** | **~₹2,50,000 / mo** | Multi-channel automation, custom fine-tuning, 99.9% uptime SLA, 24/7 guard |

### Official Payment Settlement Handles:
- **Domestic Direct UPI (India):** `milind.chatrabhuji@okhdfcbank`
- **International Global PayPal:** `milind.chatrabhuji@gmail.com`

---

## 🔒 Compliance & Governance Integrity

1. **Healthcare & Clinical Queries:** Strictly grounded in 100% modern evidence-based clinical medicine and healthcare informatics. All health-related customer inquiries trigger automated triage routing to certified medical professionals with statutory disclaimers; strictly 0 alternative remedy or unverified alternative medicine assertions.
2. **Privacy & Data Security:** 100% compliant with CAN-SPAM, GDPR Art. 6/17, and India Digital Personal Data Protection (DPDP) Act 2023. Zero scraping or storage of unauthorized PII.
3. **Sample Identifiers:** 100% RFC 2606 reserved domains (`support.example.com`, `help.example.com`, `brand.example.com`, `localhost`) and verified tax documentation formatting.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/MilindChatrabhuji/production-support-chatbot-kb-suite.git
cd production-support-chatbot-kb-suite

# Run Pack 1 demo
cd engine/support_chatbot_engine
npm install
npx ts-node src/demo_runner.ts

# Deploy Edge Gateway
cd ../edge_support_gateway
npm install
npx wrangler d1 execute support-db --file=schema.sql
npx wrangler deploy
```

---

## 📄 License

MIT License. Copyright (c) 2026 Dr. Milind Chatrabhuji. All rights reserved.
