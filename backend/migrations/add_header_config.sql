-- Tabla para almacenar la configuración del encabezado
CREATE TABLE IF NOT EXISTS header_config (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  logo_url TEXT,
  company_name TEXT,
  address TEXT,
  city TEXT,
  greeting TEXT,
  radicado_label TEXT DEFAULT 'Radicado',
  identificador_label TEXT DEFAULT 'Identificador',
  cargo_label TEXT DEFAULT 'Cargo',
  show_radicado BOOLEAN DEFAULT true,
  show_identificador BOOLEAN DEFAULT true,
  show_cargo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id)
);

CREATE INDEX idx_header_config_tenant_id ON header_config(tenant_id);

-- Insertar configuración por defecto para tenant 1
INSERT INTO header_config (tenant_id, company_name, city, greeting)
VALUES (1, 'Empresa Ejemplo', 'Bogotá D.C.', 'Cordial saludo')
ON CONFLICT (tenant_id) DO NOTHING;
