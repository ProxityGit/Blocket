import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();
const { Pool } = pkg;

console.log('🔍 DIAGNÓSTICO DE CONEXIÓN A BASE DE DATOS\n');
console.log('='.repeat(50));

// Mostrar variables de entorno (sin mostrar contraseñas completas)
console.log('\n📋 Variables de Entorno:');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'no definido');
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? '✅ Definido' : '❌ No definido');

if (process.env.DATABASE_URL) {
    // Mostrar solo parte de la URL para seguridad
    const url = process.env.DATABASE_URL;
    const match = url.match(/postgresql:\/\/([^:]+):(.+)@([^:]+):(\d+)\/(.+)/);
    if (match) {
        console.log('    - Usuario:', match[1]);
        console.log('    - Password:', '***' + match[2].slice(-4));
        console.log('    - Host:', match[3]);
        console.log('    - Puerto:', match[4]);
        console.log('    - Database:', match[5]);
    }
}

console.log('\n  Variables individuales:');
console.log('  PGHOST:', process.env.PGHOST || '❌ No definido');
console.log('  PGPORT:', process.env.PGPORT || '❌ No definido');
console.log('  PGDATABASE:', process.env.PGDATABASE || '❌ No definido');
console.log('  PGUSER:', process.env.PGUSER || '❌ No definido');
console.log('  PGPASSWORD:', process.env.PGPASSWORD ? '✅ Definido' : '❌ No definido');

console.log('\n' + '='.repeat(50));
console.log('\n🔌 Intentando conectar a PostgreSQL...\n');

// Configuración del pool
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

console.log('📝 Configuración del Pool:');
if (poolConfig.connectionString) {
    console.log('  - Usando: DATABASE_URL');
    console.log('  - SSL:', poolConfig.ssl ? 'Habilitado' : 'Deshabilitado');
} else {
    console.log('  - Usando: Variables individuales');
    console.log('  - Host:', poolConfig.host);
    console.log('  - Puerto:', poolConfig.port);
    console.log('  - Database:', poolConfig.database);
    console.log('  - User:', poolConfig.user);
    console.log('  - SSL:', poolConfig.ssl ? 'Habilitado' : 'Deshabilitado');
}

const pool = new Pool(poolConfig);

// Test 1: Conexión básica
console.log('\n' + '='.repeat(50));
console.log('\n🧪 Test 1: Conexión básica');
try {
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Conexión exitosa!');
    console.log('  - Hora del servidor:', result.rows[0].current_time);
    console.log('  - Versión PostgreSQL:', result.rows[0].pg_version.split(',')[0]);
} catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('  Código:', error.code);
    console.error('  Detalle:', error.detail || 'N/A');
    process.exit(1);
}

// Test 2: Listar tablas
console.log('\n' + '='.repeat(50));
console.log('\n🧪 Test 2: Verificar tablas existentes');
try {
    const result = await pool.query(`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    ORDER BY tablename
  `);

    if (result.rows.length === 0) {
        console.log('⚠️  No se encontraron tablas en el esquema public');
        console.log('   Necesitas ejecutar el script de inicialización de BD');
    } else {
        console.log(`✅ Se encontraron ${result.rows.length} tablas:`);
        result.rows.forEach(row => {
            console.log(`  - ${row.tablename}`);
        });
    }
} catch (error) {
    console.error('❌ Error al listar tablas:', error.message);
}

// Test 3: Verificar tabla customer_request
console.log('\n' + '='.repeat(50));
console.log('\n🧪 Test 3: Verificar tabla customer_request');
try {
    const result = await pool.query('SELECT COUNT(*) as total FROM customer_request');
    console.log(`✅ Tabla customer_request existe`);
    console.log(`  - Total de registros: ${result.rows[0].total}`);
} catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === '42P01') {
        console.log('   La tabla customer_request no existe. Ejecuta el script de inicialización.');
    }
}

// Test 4: Verificar tabla blocket
console.log('\n' + '='.repeat(50));
console.log('\n🧪 Test 4: Verificar tabla blocket');
try {
    const result = await pool.query('SELECT COUNT(*) as total FROM blocket');
    console.log(`✅ Tabla blocket existe`);
    console.log(`  - Total de bloques: ${result.rows[0].total}`);
} catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === '42P01') {
        console.log('   La tabla blocket no existe. Ejecuta el script de inicialización.');
    }
}

console.log('\n' + '='.repeat(50));
console.log('\n✅ DIAGNÓSTICO COMPLETADO\n');

await pool.end();
process.exit(0);
