import dotenv from 'dotenv';
import pkg from 'pg';

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

console.log('🔍 VERIFICANDO TABLA PROCESS\n');
console.log('='.repeat(50));

try {
    // Verificar si la tabla existe
    const tableCheck = await pool.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'process'
    );
  `);

    if (!tableCheck.rows[0].exists) {
        console.log('❌ La tabla "process" NO EXISTE');
        console.log('\n📋 Tablas existentes:');
        const tables = await pool.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
    `);
        tables.rows.forEach(row => console.log(`  - ${row.tablename}`));

        console.log('\n⚠️  SOLUCIÓN: Ejecuta el script de inicialización de BD');
        process.exit(1);
    }

    console.log('✅ La tabla "process" existe\n');

    // Verificar estructura de la tabla
    console.log('📋 Estructura de la tabla "process":');
    const columns = await pool.query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'process'
    ORDER BY ordinal_position;
  `);

    columns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });

    // Verificar si tiene tenant_id
    const hasTenantId = columns.rows.some(col => col.column_name === 'tenant_id');
    if (!hasTenantId) {
        console.log('\n⚠️  ADVERTENCIA: La tabla NO tiene el campo "tenant_id"');
        console.log('   Esto puede causar errores si el código espera ese campo.');
    }

    // Contar registros
    console.log('\n📊 Datos en la tabla:');
    const count = await pool.query('SELECT COUNT(*) as total FROM process');
    console.log(`  - Total de procesos: ${count.rows[0].total}`);

    if (parseInt(count.rows[0].total) > 0) {
        const processes = await pool.query('SELECT * FROM process LIMIT 5');
        console.log('\n  Primeros 5 procesos:');
        processes.rows.forEach(p => {
            console.log(`    - ID: ${p.id}, Nombre: ${p.name}, Activo: ${p.is_active}`);
        });
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ VERIFICACIÓN COMPLETADA\n');

} catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('   Código:', error.code);
    if (error.code === '42P01') {
        console.log('\n⚠️  La tabla "process" no existe. Ejecuta el script de inicialización.');
    }
}

await pool.end();
process.exit(0);
