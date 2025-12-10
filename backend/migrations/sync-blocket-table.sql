-- ============================================
-- MIGRACIÓN: Sincronizar tabla blocket
-- ============================================
-- Ejecutar en pgAdmin conectado a Render

-- 1. Ver estructura actual
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'blocket' 
ORDER BY ordinal_position;

-- 2. Agregar columna is_published si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blocket' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE blocket ADD COLUMN is_published BOOLEAN DEFAULT false;
    RAISE NOTICE '✅ Columna is_published agregada';
  ELSE
    RAISE NOTICE '⚠️  Columna is_published ya existe';
  END IF;
END $$;

-- 3. Agregar columna updated_by si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blocket' AND column_name = 'updated_by'
  ) THEN
    ALTER TABLE blocket ADD COLUMN updated_by TEXT;
    RAISE NOTICE '✅ Columna updated_by agregada';
  ELSE
    RAISE NOTICE '⚠️  Columna updated_by ya existe';
  END IF;
END $$;

-- 4. Verificar resultado
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'blocket' 
ORDER BY ordinal_position;

-- 5. Mostrar datos actuales
SELECT id, title, key, is_active, is_published, created_at 
FROM blocket 
ORDER BY id 
LIMIT 5;
