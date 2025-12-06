import dotenv from 'dotenv';
import pkg from 'pg';
import fs from 'fs';

dotenv.config();
const { Pool } = pkg;

const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    }
    : {
        host: process.env.PGHOST,
        port: process.env.PGPORT || 5432,
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };

const pool = new Pool(poolConfig);

console.log('📋 ESTRUCTURA DE LA TABLA PROCESS\n');

try {
    // Obtener estructura de la tabla
    const columns = await pool.query(`
    SELECT 
      column_name, 
      data_type, 
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_name = 'process'
    ORDER BY ordinal_position;
  `);

    if (columns.rows.length === 0) {
        console.log('❌ La tabla "process" NO EXISTE\n');
        process.exit(1);
    }

    console.log('Columnas actuales:\n');
    columns.rows.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        console.log(`  ${col.column_name.padEnd(20)} ${col.data_type.padEnd(25)} ${nullable}${defaultVal}`);
    });

    // Generar script de migración
    console.log('\n' + '='.repeat(70));
    console.log('\n📝 SCRIPT DE MIGRACIÓN PARA RENDER:\n');

    const migrationSQL = `-- Migración: Agregar columna updated_at a la tabla process
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
`;

    console.log(migrationSQL);

    // Guardar en archivo
    fs.writeFileSync('migration-add-updated-at.sql', migrationSQL);
    console.log('\n✅ Script guardado en: migration-add-updated-at.sql');
    console.log('\n📌 INSTRUCCIONES:');
    console.log('   1. Ve a Render Dashboard → blocket-db → Shell');
    console.log('   2. Copia y pega el contenido del archivo migration-add-updated-at.sql');
    console.log('   3. Presiona Enter para ejecutar');
    console.log('   4. Verifica que aparezca "Columna updated_at agregada exitosamente"\n');

} catch (error) {
    console.error('\n❌ ERROR:', error.message);
}

await pool.end();
process.exit(0);
