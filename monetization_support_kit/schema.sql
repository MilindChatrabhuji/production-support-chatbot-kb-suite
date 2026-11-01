-- D1 Retainer Billing Database Schema
CREATE TABLE IF NOT EXISTS support_retainer_clients (
  client_id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  tier TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  is_domestic INTEGER NOT NULL DEFAULT 0,
  monthly_fee REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS retainer_invoices (
  invoice_id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  amount REAL NOT NULL,
  tax_amount REAL NOT NULL DEFAULT 0.0,
  total_payable REAL NOT NULL,
  currency TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  paid_status TEXT NOT NULL DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES support_retainer_clients(client_id)
);
