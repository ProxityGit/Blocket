import pool from './db.js';

async function checkDynamicFieldTable() {
  console.log('🔍 Verificando estructura de blocket_dynamic_field...\n');

  try {
    // Verificar si existe la tabla
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'blocket_dynamic_field'
      );
    `);

    if (tableCheck.rows[0].exists) {
      console.log('✅ La tabla blocket_dynamic_field YA EXISTE\n');
      
      // Obtener estructura
      const structure = await pool.query(`
        SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'blocket_dynamic_field' 
        ORDER BY ordinal_position
      `);
      
      console.log('📋 Estructura actual:');
      console.table(structure.rows);
      
      // Verificar datos existentes
      const count = await pool.query('SELECT COUNT(*) FROM blocket_dynamic_field');
      console.log(`\n📊 Total de campos dinámicos existentes: ${count.rows[0].count}\n`);
      
      if (parseInt(count.rows[0].count) > 0) {
        const sample = await pool.query('SELECT * FROM blocket_dynamic_field LIMIT 3');
        console.log('📦 Datos de ejemplo:');
        console.table(sample.rows);
      }
      
    } else {
      console.log('❌ La tabla blocket_dynamic_field NO EXISTE');
      console.log('\n📝 Necesitas crearla con:');
      console.log(`
CREATE TABLE blocket_dynamic_field (
  id BIGSERIAL PRIMARY KEY,
  blocket_id BIGINT NOT NULL REFERENCES blocket(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL,
  field_placeholder TEXT,
  is_required BOOLEAN DEFAULT true,
  validation_rules JSONB,
  default_value TEXT,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_field_per_block UNIQUE(blocket_id, field_name)
);

CREATE INDEX idx_blocket_dynamic_field_blocket_id ON blocket_dynamic_field(blocket_id);
      `);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pool.end();
  }
}

checkDynamicFieldTable();
