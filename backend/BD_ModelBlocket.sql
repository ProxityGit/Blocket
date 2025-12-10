CREATE TABLE customer_request (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  channel_id BIGINT REFERENCES channel(id),
  status_id BIGINT REFERENCES status(id),
  customer_name TEXT NOT NULL,
  customer_identifier TEXT,
  request_type TEXT,
  subject TEXT,
  message TEXT,
  payload_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT,
  updated_by TEXT
);

CREATE INDEX idx_customer_request_tenant_id ON customer_request(tenant_id);
CREATE INDEX idx_customer_request_channel_id ON customer_request(channel_id);
CREATE INDEX idx_customer_request_status_id ON customer_request(status_id);