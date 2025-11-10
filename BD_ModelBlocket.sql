CREATE TABLE status (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  code TEXT NOT NULL,         -- Ejemplo: 'RECEIVED', 'PENDING', 'INTEGRATED', 'ERROR'
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_status_tenant_id ON status(tenant_id);
CREATE INDEX idx_status_code ON status(code);