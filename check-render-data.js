import pg from 'pg';

const DATABASE_URL = process.argv[2];

if (!DATABASE_URL) {
  console.error('Proporciona la DATABASE_URL como argumento');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkData() {
  try {
    console.log('📊 Verificando datos en la base de datos...\n');
    
    // Verificar solicitudes
    const requests = await pool.query('SELECT COUNT(*) as total FROM customer_request');
    console.log(`✅ Solicitudes: ${requests.rows[0].total}`);
    
    // Verificar tenants
    const tenants = await pool.query('SELECT * FROM tenant');
    console.log(`✅ Tenants: ${tenants.rowCount}`);
    tenants.rows.forEach(t => console.log(`   - ${t.nombre} (ID: ${t.id})`));
    
    // Verificar channels
    const channels = await pool.query('SELECT * FROM channel');
    console.log(`\n✅ Channels: ${channels.rowCount}`);
    channels.rows.forEach(c => console.log(`   - ${c.name} (ID: ${c.id})`));
    
    // Verificar status
    const statuses = await pool.query('SELECT * FROM status');
    console.log(`\n✅ Status: ${statuses.rowCount}`);
    statuses.rows.forEach(s => console.log(`   - ${s.name} (ID: ${s.id})`));
    
    // Verificar bloques
    const blocks = await pool.query('SELECT COUNT(*) as total FROM blocket');
    console.log(`\n✅ Bloques: ${blocks.rows[0].total}`);
    
    console.log('\n🔗 Probando conexión del backend...');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkData();
