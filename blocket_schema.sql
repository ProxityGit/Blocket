-- Blocket Database Schema - Versión simplificada para Render

-- Tabla de Tenants (Empresas)
CREATE TABLE IF NOT EXISTS tenant (
    id BIGSERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Canales
CREATE TABLE IF NOT EXISTS channel (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenant(id),
    name TEXT NOT NULL,
    code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Estados
CREATE TABLE IF NOT EXISTS status (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenant(id),
    name TEXT NOT NULL,
    code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Categorías
CREATE TABLE IF NOT EXISTS category (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenant(id),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Procesos
CREATE TABLE IF NOT EXISTS process (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenant(id),
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Solicitudes (Principal)
CREATE TABLE IF NOT EXISTS customer_request (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenant(id),
    channel_id BIGINT REFERENCES channel(id),
    status_id BIGINT REFERENCES status(id),
    customer_name TEXT NOT NULL,
    customer_identifier TEXT,
    tipo_identificacion TEXT,
    email TEXT,
    tipo_cliente TEXT,
    request_type TEXT,
    subject TEXT,
    country TEXT,
    departamento TEXT,
    ciudad TEXT,
    message TEXT,
    payload_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT,
    updated_by TEXT
);

-- Tabla de Adjuntos
CREATE TABLE IF NOT EXISTS attachment (
    id BIGSERIAL PRIMARY KEY,
    request_id BIGINT NOT NULL REFERENCES customer_request(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    uploaded_by TEXT
);

-- Tabla de Bloques de Texto
CREATE TABLE IF NOT EXISTS blocket (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenant(id),
    process_id BIGINT REFERENCES process(id),
    category_id BIGINT REFERENCES category(id),
    title TEXT NOT NULL,
    key TEXT,
    template_html TEXT,
    version INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT
);

-- Tabla de Campos Dinámicos de Bloques
CREATE TABLE IF NOT EXISTS blocket_dynamic_field (
    id BIGSERIAL PRIMARY KEY,
    blocket_id BIGINT NOT NULL REFERENCES blocket(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    label TEXT NOT NULL,
    type TEXT DEFAULT 'text',
    required BOOLEAN DEFAULT false,
    options_json JSONB,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Log de Estados
CREATE TABLE IF NOT EXISTS request_status_log (
    id BIGSERIAL PRIMARY KEY,
    request_id BIGINT NOT NULL REFERENCES customer_request(id) ON DELETE CASCADE,
    old_status_id BIGINT REFERENCES status(id),
    new_status_id BIGINT REFERENCES status(id),
    changed_by TEXT,
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS "user" (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenant(id),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    full_name TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_customer_request_tenant_id ON customer_request(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customer_request_channel_id ON customer_request(channel_id);
CREATE INDEX IF NOT EXISTS idx_customer_request_status_id ON customer_request(status_id);
CREATE INDEX IF NOT EXISTS idx_attachment_request_id ON attachment(request_id);
CREATE INDEX IF NOT EXISTS idx_blocket_tenant_id ON blocket(tenant_id);
CREATE INDEX IF NOT EXISTS idx_blocket_process_id ON blocket(process_id);
CREATE INDEX IF NOT EXISTS idx_blocket_category_id ON blocket(category_id);
CREATE INDEX IF NOT EXISTS idx_blocket_dynamic_field_blocket_id ON blocket_dynamic_field(blocket_id);

-- Datos iniciales
INSERT INTO tenant (id, nombre, activo) VALUES (1, 'Default Tenant', true) ON CONFLICT DO NOTHING;
INSERT INTO channel (id, tenant_id, name, code) VALUES (1, 1, 'Web', 'WEB') ON CONFLICT DO NOTHING;
INSERT INTO channel (id, tenant_id, name, code) VALUES (2, 1, 'Email', 'EMAIL') ON CONFLICT DO NOTHING;
INSERT INTO channel (id, tenant_id, name, code) VALUES (3, 1, 'Phone', 'PHONE') ON CONFLICT DO NOTHING;
INSERT INTO status (id, tenant_id, name, code) VALUES (1, 1, 'Nueva', 'NEW') ON CONFLICT DO NOTHING;
INSERT INTO status (id, tenant_id, name, code) VALUES (2, 1, 'En Proceso', 'IN_PROGRESS') ON CONFLICT DO NOTHING;
INSERT INTO status (id, tenant_id, name, code) VALUES (3, 1, 'Resuelta', 'RESOLVED') ON CONFLICT DO NOTHING;
