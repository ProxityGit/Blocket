import pool from './db.js';

async function addCargoFields() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Agregando campos cargo_label y show_cargo...');
    
    // Agregar columnas si no existen
    await client.query(`
      ALTER TABLE header_config 
      ADD COLUMN IF NOT EXISTS cargo_label TEXT DEFAULT 'Cargo',
      ADD COLUMN IF NOT EXISTS show_cargo BOOLEAN DEFAULT false;
    `);
    
    console.log('✅ Campos agregados exitosamente');
    
    // Verificar la estructura actualizada
    const result = await client.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'header_config'
      ORDER BY ordinal_position;
    `);
    
    console.log('📊 Estructura de la tabla header_config:');
    console.table(result.rows);
    
  } catch (error) {
    console.error('❌ Error al agregar campos:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addCargoFields();
