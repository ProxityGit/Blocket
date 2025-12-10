import dotenv from 'dotenv';
dotenv.config();

console.log('--- Credenciales de Base de Datos Local ---');
if (process.env.DATABASE_URL) {
    console.log('URL Completa:', process.env.DATABASE_URL);
} else {
    console.log('Host:', process.env.PGHOST || 'localhost (defecto)');
    console.log('Puerto:', process.env.PGPORT || '5432 (defecto)');
    console.log('Base de Datos:', process.env.PGDATABASE || process.env.PGUSER || '(Usuario del sistema)');
    console.log('Usuario:', process.env.PGUSER || '(Usuario del sistema)');
    console.log('Contraseña:', process.env.PGPASSWORD ? '****** (Definida)' : '(No definida / Confianza)');

    if (process.env.PGPASSWORD) {
        console.log('Password (Valor real para copiar):', process.env.PGPASSWORD);
    }
}
console.log('-------------------------------------------');
