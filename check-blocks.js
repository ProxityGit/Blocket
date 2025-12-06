import pool from './db.js';

async function checkBlocks() {
  try {
    const result = await pool.query('SELECT id, title, process_id, is_active FROM blocket LIMIT 10');
    console.log('Total bloques:', result.rows.length);
    console.log('Bloques:', JSON.stringify(result.rows, null, 2));
    
    const processResult = await pool.query('SELECT id, name FROM process');
    console.log('\nProcesos:', JSON.stringify(processResult.rows, null, 2));
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkBlocks();
