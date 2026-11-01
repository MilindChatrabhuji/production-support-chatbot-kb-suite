-- Production Support Chatbot & RAG D1 SQLite Schema
CREATE TABLE IF NOT EXISTS support_sessions (
  id TEXT PRIMARY KEY,
  channel TEXT NOT NULL DEFAULT 'web_chat',
  user_identifier TEXT NOT NULL,
  turn_count INTEGER NOT NULL DEFAULT 1,
  deflected INTEGER NOT NULL DEFAULT 1, -- 1=True, 0=False
  status TEXT NOT NULL DEFAULT 'active',
  csat_score INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS knowledge_embeddings (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  token_count INTEGER NOT NULL,
  source_url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS escalation_tickets (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  urgency INTEGER NOT NULL DEFAULT 3,
  escalation_reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES support_sessions(id)
);

CREATE TABLE IF NOT EXISTS deflection_audit_log (
  id TEXT PRIMARY KEY,
  query_text TEXT NOT NULL,
  classified_intent TEXT NOT NULL,
  deflection_score REAL NOT NULL,
  action_taken TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON support_sessions(user_identifier);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON escalation_tickets(status);
