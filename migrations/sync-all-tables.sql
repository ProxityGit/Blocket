-- ============================================
-- MIGRACIÓN COMPLETA: Sincronizar TODAS las tablas
-- ============================================
-- Ejecutar en pgAdmin conectado a Render
-- Este script agrega todas las columnas faltantes

-- ============================================
-- TABLA: process
-- ============================================

-- Agregar updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'process' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE process ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    UPDATE process SET updated_at = created_at WHERE updated_at IS NULL;
    RAISE NOTICE '✅ process.updated_at agregada';
  ELSE
    RAISE NOTICE '⚠️  process.updated_at ya existe';
  END IF;
END $$;

-- ============================================
-- TABLA: blocket
-- ============================================

-- Agregar is_published
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blocket' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE blocket ADD COLUMN is_published BOOLEAN DEFAULT false;
    RAISE NOTICE '✅ blocket.is_published agregada';
  ELSE
    RAISE NOTICE '⚠️  blocket.is_published ya existe';
  END IF;
END $$;

-- Agregar updated_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blocket' AND column_name = 'updated_by'
  ) THEN
    ALTER TABLE blocket ADD COLUMN updated_by TEXT;
    RAISE NOTICE '✅ blocket.updated_by agregada';
  ELSE
    RAISE NOTICE '⚠️  blocket.updated_by ya existe';
  END IF;
END $$;

-- ============================================
-- TABLA: category
-- ============================================

-- Agregar updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'category' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE category ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    UPDATE category SET updated_at = created_at WHERE updated_at IS NULL;
    RAISE NOTICE '✅ category.updated_at agregada';
  ELSE
    RAISE NOTICE '⚠️  category.updated_at ya existe';
  END IF;
END $$;

-- Agregar is_active
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'category' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE category ADD COLUMN is_active BOOLEAN DEFAULT true;
    RAISE NOTICE '✅ category.is_active agregada';
  ELSE
    RAISE NOTICE '⚠️  category.is_active ya existe';
  END IF;
END $$;

-- ============================================
-- TABLA: header_config
-- ============================================

-- Crear tabla header_config si no existe
CREATE TABLE IF NOT EXISTS header_config (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL DEFAULT 1,
    logo_url TEXT,
    company_name TEXT,
    address TEXT,
    city TEXT,
    greeting TEXT DEFAULT 'Cordial saludo',
    radicado_label TEXT DEFAULT 'Radicado',
    identificador_label TEXT DEFAULT 'Identificador',
    cargo_label TEXT DEFAULT 'Cargo',
    show_radicado BOOLEAN DEFAULT true,
    show_identificador BOOLEAN DEFAULT true,
    show_cargo BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id)
);

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

-- Verificar process
SELECT 'process' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'process' 
ORDER BY ordinal_position;

-- Verificar blocket
SELECT 'blocket' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'blocket' 
ORDER BY ordinal_position;

-- Verificar category
SELECT 'category' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'category' 
ORDER BY ordinal_position;

-- Verificar header_config
SELECT 'header_config' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'header_config' 
ORDER BY ordinal_position;

-- ============================================
-- RESUMEN
-- ============================================

SELECT 
  'MIGRACIÓN COMPLETADA' as status,
  NOW() as timestamp;
