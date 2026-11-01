# Deployment Manual: Enterprise AI Customer Support Chatbot & RAG Suite

## 1. Prerequisites
- Node.js 18.0.0 or higher
- Cloudflare Wrangler CLI (`npm install -g wrangler`)
- Cloudflare D1 Database binding (`support_db`)

## 2. Local Verification
```bash
cd engine/support_chatbot_engine
npm install
npx ts-node src/demo_runner.ts
```

## 3. Edge Gateway Deployment
```bash
cd engine/edge_support_gateway
npm install
npx wrangler d1 create support_db
# Update wrangler.toml with database_id
npx wrangler d1 execute support_db --file=schema.sql
npx wrangler deploy
```

## 4. Environment Variables
- `SUPPORT_API_SECRET`: HMAC authentication secret for CRM webhooks
- `KB_SIMILARITY_THRESHOLD`: Default `0.78`
- `DEFLECTION_THRESHOLD`: Default `0.65`
- `ESCALATION_EMAIL`: `support@support.example.com`
