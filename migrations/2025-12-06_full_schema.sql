-- MIGRACIÓN COMPLETA PARA BLOCKET (Render)

-- Tabla principal de bloques
CREATE TABLE IF NOT EXISTS blocket (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  texto TEXT,
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  process_id INTEGER,
  category_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de campos dinámicos de bloque
CREATE TABLE IF NOT EXISTS blocket_dynamic_field (
  id SERIAL PRIMARY KEY,
  blocket_id INTEGER REFERENCES blocket(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  label VARCHAR(255),
  type VARCHAR(50) DEFAULT 'text',
  required BOOLEAN DEFAULT true
);

-- Tabla de procesos
CREATE TABLE IF NOT EXISTS process (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS category (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Tabla de solicitudes
CREATE TABLE IF NOT EXISTS customer_request (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  asunto VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de adjuntos
CREATE TABLE IF NOT EXISTS attachment (
  id SERIAL PRIMARY KEY,
  request_id INTEGER REFERENCES customer_request(id) ON DELETE CASCADE,
  filename VARCHAR(255),
  url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS "user" (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true
);

-- Tabla de tenant
CREATE TABLE IF NOT EXISTS tenant (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de status
CREATE TABLE IF NOT EXISTS status (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Tabla de log de estado de solicitud
CREATE TABLE IF NOT EXISTS request_status_log (
  id SERIAL PRIMARY KEY,
  request_id INTEGER REFERENCES customer_request(id) ON DELETE CASCADE,
  status_id INTEGER REFERENCES status(id),
  changed_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de canales
CREATE TABLE IF NOT EXISTS channel (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Tabla de configuración de encabezado
CREATE TABLE IF NOT EXISTS header_config (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER REFERENCES tenant(id),
  logo_url TEXT,
  company_name VARCHAR(255),
  address VARCHAR(255),
  city VARCHAR(100),
  greeting VARCHAR(255),
  radicado_label VARCHAR(100),
  identificador_label VARCHAR(100),
  cargo_label VARCHAR(100),
  show_radicado BOOLEAN DEFAULT true,
  show_identificador BOOLEAN DEFAULT true,
  show_cargo BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
