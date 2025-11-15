import pool from './db.js';

pool.query(`
  SELECT column_name, data_type, character_maximum_length 
  FROM information_schema.columns 
  WHERE table_name = 'blocket' 
  ORDER BY ordinal_position
`, (err, res) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Estructura de la tabla blocket:');
    console.table(res.rows);
  }
  pool.end();
});
