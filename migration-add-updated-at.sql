-- Migración: Agregar columna updated_at a la tabla process
-- Ejecutar este script en Render Shell o pgAdmin

-- Verificar si la columna ya existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'process' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE process ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE 'Columna updated_at agregada exitosamente';
  ELSE
    RAISE NOTICE 'La columna updated_at ya existe';
  END IF;
END $$;

-- Actualizar registros existentes
UPDATE process SET updated_at = created_at WHERE updated_at IS NULL;

-- Verificar resultado
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'process' 
ORDER BY ordinal_position;
