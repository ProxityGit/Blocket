import pool from './db.js';
import fs from 'fs';

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Ejecutando migración para header_config...');
    
    const sql = fs.readFileSync('./migrations/add_header_config.sql', 'utf8');
    
    await client.query(sql);
    
    console.log('✅ Migración completada exitosamente');
    console.log('📝 Tabla header_config creada');
    
    // Verificar que se insertó el registro por defecto
    const result = await client.query('SELECT * FROM header_config WHERE tenant_id = 1');
    console.log('📊 Configuración por defecto:', result.rows[0]);
    
  } catch (error) {
    console.error('❌ Error al ejecutar migración:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
