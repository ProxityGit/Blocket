import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();
const { Pool } = pkg;

// IMPORTANTE: Este script debe ejecutarse con DATABASE_URL de Render
const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
};

const pool = new Pool(poolConfig);

console.log('🔧 EJECUTANDO MIGRACIÓN EN RENDER\n');
console.log('='.repeat(60));

async function runMigration() {
    const client = await pool.connect();

    try {
        console.log('\n✅ Conectado a la base de datos');
        console.log('   Host:', poolConfig.connectionString.split('@')[1]?.split(':')[0] || 'unknown');

        // Migración 1: Agregar is_published a blocket
        console.log('\n📝 Agregando columna is_published a blocket...');
        try {
            await client.query(`
        ALTER TABLE blocket ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
      `);
            console.log('   ✅ is_published agregada');
        } catch (err) {
            if (err.code === '42701') {
                console.log('   ⚠️  is_published ya existe');
            } else {
                throw err;
            }
        }

        // Migración 2: Agregar updated_by a blocket
        console.log('\n📝 Agregando columna updated_by a blocket...');
        try {
            await client.query(`
        ALTER TABLE blocket ADD COLUMN IF NOT EXISTS updated_by TEXT;
      `);
            console.log('   ✅ updated_by agregada');
        } catch (err) {
            if (err.code === '42701') {
                console.log('   ⚠️  updated_by ya existe');
            } else {
                throw err;
            }
        }

        // Migración 3: Agregar updated_at a process
        console.log('\n📝 Agregando columna updated_at a process...');
        try {
            await client.query(`
        ALTER TABLE process ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
      `);
            await client.query(`
        UPDATE process SET updated_at = created_at WHERE updated_at IS NULL;
      `);
            console.log('   ✅ updated_at agregada');
        } catch (err) {
            if (err.code === '42701') {
                console.log('   ⚠️  updated_at ya existe');
            } else {
                throw err;
            }
        }

        // Verificar estructura final
        console.log('\n📋 Verificando estructura de blocket:');
        const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'blocket' 
      ORDER BY ordinal_position;
    `);

        columns.rows.forEach(col => {
            console.log(`   - ${col.column_name.padEnd(20)} (${col.data_type})`);
        });

        console.log('\n' + '='.repeat(60));
        console.log('✅ MIGRACIÓN COMPLETADA EXITOSAMENTE\n');

    } catch (error) {
        console.error('\n❌ ERROR EN LA MIGRACIÓN:');
        console.error('   ', error.message);
        console.error('   Código:', error.code);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();
