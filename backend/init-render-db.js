import { readFileSync } from 'fs';
import pg from 'pg';

// Pide la URL de conexión de Render
const DATABASE_URL = process.argv[2];

if (!DATABASE_URL) {
  console.error('❌ Error: Debes proporcionar la DATABASE_URL');
  console.log('\nUso:');
  console.log('  node init-render-db.js "postgresql://user:pass@host:port/database"');
  console.log('\nPara obtener la URL:');
  console.log('  1. Ve a Render Dashboard');
  console.log('  2. Click en blocket-db');
  console.log('  3. Copia "External Database URL" o "Internal Database URL"');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDatabase() {
  console.log('🚀 Iniciando configuración de base de datos en Render...\n');
  
  try {
    // Verificar conexión
    console.log('🔍 Verificando conexión...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa\n');

    // Leer el archivo SQL schema
    console.log('📄 Leyendo schema SQL...');
    const sqlScript = readFileSync('blocket_schema.sql', 'utf8');
    console.log('✅ Archivo cargado\n');

    // Ejecutar el script SQL
    console.log('⚙️  Ejecutando script de base de datos...');
    console.log('   (Esto puede tomar 1-2 minutos)');
    
    await pool.query(sqlScript);
    
    console.log('✅ Base de datos inicializada\n');

    // Verificar tablas creadas
    console.log('🔍 Verificando tablas...');
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log(`\n✅ ${result.rows.length} tablas creadas:`);
    result.rows.forEach(row => console.log(`   - ${row.table_name}`));

    console.log('\n🎉 ¡Base de datos lista para usar!');

  } catch (error) {
    console.error('\n❌ Error al inicializar la base de datos:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
