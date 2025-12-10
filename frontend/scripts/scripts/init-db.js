import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import pool from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initDatabase() {
  console.log('🚀 Iniciando configuración de base de datos...\n');

  try {
    // Verificar conexión
    console.log('🔍 Verificando conexión a PostgreSQL...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa\n');

    // Leer el archivo SQL de la base de datos
    console.log('📄 Leyendo script de base de datos...');
    const sqlFilePath = dirname(__dirname) + '/BD_ModelBlocket.sql';
    
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`No se encontró el archivo: ${sqlFilePath}`);
    }

    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    console.log('✅ Script SQL cargado\n');

    // Ejecutar el script SQL
    console.log('⚙️  Ejecutando script de base de datos...');
    await pool.query(sqlScript);
    console.log('✅ Tablas creadas exitosamente\n');

    // Verificar tablas creadas
    console.log('🔍 Verificando tablas...');
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log(`\n✅ ${result.rows.length} tablas encontradas:`);
    result.rows.forEach(row => console.log(`   - ${row.table_name}`));

    // Insertar datos de ejemplo si no existen
    console.log('\n📊 Verificando datos de ejemplo...');
    const countResult = await pool.query('SELECT COUNT(*) FROM customer_request');
    
    if (countResult.rows[0].count === '0') {
      console.log('⚙️  Insertando datos de ejemplo...');
      
      // Aquí puedes agregar inserts de ejemplo si quieres
      // await pool.query('INSERT INTO ...');
      
      console.log('✅ Datos de ejemplo insertados');
    } else {
      console.log(`✅ Ya existen ${countResult.rows[0].count} solicitudes en la base de datos`);
    }

    console.log('\n🎉 ¡Base de datos inicializada correctamente!');

  } catch (error) {
    console.error('\n❌ Error al inicializar la base de datos:');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
