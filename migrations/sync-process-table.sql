-- ============================================
-- MIGRACIÓN COMPLETA: Sincronizar tabla process
-- ============================================
-- Ejecutar en Render Dashboard → blocket-db → Shell
-- Comando: psql $DATABASE_URL

-- 1. Verificar estructura actual
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'process' 
ORDER BY ordinal_position;

-- 2. Agregar columna updated_at si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'process' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE process ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE '✅ Columna updated_at agregada';
  ELSE
    RAISE NOTICE '⚠️  Columna updated_at ya existe';
  END IF;
END $$;

-- 3. Agregar columna description si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'process' AND column_name = 'description'
  ) THEN
    ALTER TABLE process ADD COLUMN description TEXT;
    RAISE NOTICE '✅ Columna description agregada';
  ELSE
    RAISE NOTICE '⚠️  Columna description ya existe';
  END IF;
END $$;

-- 4. Actualizar registros existentes
UPDATE process 
SET updated_at = COALESCE(updated_at, created_at, NOW())
WHERE updated_at IS NULL;

-- 5. Verificar resultado final
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'process' 
ORDER BY ordinal_position;

-- 6. Mostrar datos actuales
SELECT id, name, is_active, created_at, updated_at 
FROM process 
ORDER BY id 
LIMIT 5;
