import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : {
        rejectUnauthorized: false
    }
});

async function migrate() {
    try {
        await client.connect();
        console.log('🔌 Conectado a la base de datos');

        // Intentar insertar en 'category'
        // Nota: Si la columna tenant_id no existe o es serial, ajustaremos.
        // Asumiremos una estructura simple primero.

        // Primero verifiquemos las columnas de la tabla category para no fallar
        const checkTable = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'category';
    `);

        const columns = checkTable.rows.map(row => row.column_name);
        console.log('Columnas en category:', columns);

        if (columns.length === 0) {
            console.error('❌ La tabla category NO existe.');
            return;
        }

        let insertQuery = '';

        // Lógica dinámica básica para construir el insert según columnas existentes
        if (columns.includes('tenant_id')) {
            insertQuery = `
          INSERT INTO category (id, tenant_id, name, description, is_active)
          VALUES (1, 'default', 'General', 'Categoría General', true)
          ON CONFLICT (id) DO NOTHING;
        `;
        } else {
            insertQuery = `
          INSERT INTO category (id, name, description, is_active)
          VALUES (1, 'General', 'Categoría General', true)
          ON CONFLICT (id) DO NOTHING;
        `;
        }

        console.log('qm Ejecutando query:', insertQuery);
        await client.query(insertQuery);

        console.log('✅ Categoría ID 1 asegurada.');

    } catch (err) {
        console.error('❌ Error en la migración:', err);
    } finally {
        await client.end();
    }
}

migrate();
