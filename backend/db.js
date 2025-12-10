import dotenv from 'dotenv';
import pkg from 'pg';
dotenv.config();

const { Pool } = pkg;

// Configuración flexible: soporta DATABASE_URL o variables individuales
const poolConfig = process.env.DATABASE_URL
  ? {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  }
  : {
    host: process.env.PGHOST,
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };

const pool = new Pool(poolConfig);

// Logging de diagnóstico (solo en desarrollo o al iniciar)
console.log('🔌 Configuración de base de datos:');
console.log('  - Modo:', process.env.NODE_ENV || 'development');
console.log('  - Usando DATABASE_URL:', !!process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
  console.log('  - Host:', process.env.PGHOST);
  console.log('  - Database:', process.env.PGDATABASE);
  console.log('  - User:', process.env.PGUSER);
}

// Test de conexión al iniciar
pool.on('connect', () => {
  console.log('✅ Conexión a PostgreSQL establecida');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de PostgreSQL:', err);
});

export default pool;