import pool from './db.js';

async function testBlocksAPI() {
  console.log('🧪 Probando API de bloques...\n');

  try {
    // 1. Verificar que existe la tabla blocket_dynamic_field
    console.log('1️⃣ Verificando tabla blocket_dynamic_field...');
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'blocket_dynamic_field'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ La tabla blocket_dynamic_field no existe. Créala primero.\n');
      pool.end();
      return;
    }
    console.log('✅ Tabla blocket_dynamic_field existe\n');

    // 2. Verificar si hay bloques en la BD
    console.log('2️⃣ Consultando bloques existentes...');
    const blocksResult = await pool.query('SELECT COUNT(*) FROM blocket');
    console.log(`📊 Total de bloques: ${blocksResult.rows[0].count}\n`);

    // 3. Verificar si hay campos dinámicos
    console.log('3️⃣ Consultando campos dinámicos...');
    const fieldsResult = await pool.query('SELECT COUNT(*) FROM blocket_dynamic_field');
    console.log(`📊 Total de campos dinámicos: ${fieldsResult.rows[0].count}\n`);

    // 4. Obtener un bloque de ejemplo con sus campos
    if (parseInt(blocksResult.rows[0].count) > 0) {
      console.log('4️⃣ Obteniendo bloque de ejemplo...');
      const blockQuery = `
        SELECT b.*, 
               (SELECT json_agg(json_build_object(
                 'id', f.id,
                 'name', f.field_name,
                 'label', f.field_label,
                 'type', f.field_type
               ) ORDER BY f.sort_order)
               FROM blocket_dynamic_field f
               WHERE f.blocket_id = b.id
               ) as campos
        FROM blocket b
        WHERE b.is_active = true
        LIMIT 1
      `;
      const example = await pool.query(blockQuery);
      
      if (example.rows.length > 0) {
        const block = example.rows[0];
        console.log('📦 Bloque de ejemplo:');
        console.log(`   ID: ${block.id}`);
        console.log(`   Título: ${block.title}`);
        console.log(`   Key: ${block.key}`);
        console.log(`   Campos: ${block.campos ? JSON.stringify(block.campos, null, 2) : 'Sin campos'}\n`);
      }
    } else {
      console.log('⚠️  No hay bloques en la BD aún.\n');
    }

    console.log('✅ Prueba completada exitosamente');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Insertar bloques de prueba en la tabla blocket');
    console.log('   2. Insertar campos dinámicos en blocket_dynamic_field');
    console.log('   3. Probar endpoint: GET http://localhost:3000/api/blocks');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pool.end();
  }
}

testBlocksAPI();
