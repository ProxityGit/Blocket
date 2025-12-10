import { readFileSync } from 'fs';
import pg from 'pg';

const DATABASE_URL = process.argv[2];
const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function insertTestData() {
  try {
    console.log('📝 Insertando datos de prueba...\n');
    
    const sql = readFileSync('insert-test-data.sql', 'utf8');
    await pool.query(sql);
    
    console.log('✅ Datos insertados correctamente\n');
    
    const result = await pool.query('SELECT * FROM customer_request');
    console.log(`📊 Total de solicitudes: ${result.rowCount}\n`);
    result.rows.forEach(r => {
      console.log(`- ${r.customer_name} (${r.request_type}): ${r.subject}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

insertTestData();
