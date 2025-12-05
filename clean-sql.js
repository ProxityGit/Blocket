import { readFileSync, writeFileSync } from 'fs';

console.log('🔧 Limpiando backup SQL para Render...\n');

// Leer el backup completo
const sqlScript = readFileSync('blocket_backup.sql', 'utf8');

// Eliminar comandos específicos de pg_dump que causan problemas
let cleanedSql = sqlScript
  // Eliminar comandos de control de pg_dump
  .replace(/\\restrict.*$/gm, '')
  .replace(/\\unrestrict.*$/gm, '')
  .replace(/\\connect.*$/gm, '')
  // Eliminar comandos de creación de base de datos
  .replace(/CREATE DATABASE.*$/gm, '')
  .replace(/ALTER DATABASE.*$/gm, '')
  // Eliminar comentarios TOC
  .replace(/^-- TOC entry.*$/gm, '')
  // Eliminar comandos de configuración global
  .replace(/^SET statement_timeout.*$/gm, '')
  .replace(/^SET lock_timeout.*$/gm, '')
  .replace(/^SET idle_in_transaction_session_timeout.*$/gm, '')
  .replace(/^SET transaction_timeout.*$/gm, '')
  .replace(/^SET client_encoding.*$/gm, '')
  .replace(/^SET standard_conforming_strings.*$/gm, '')
  .replace(/^SET check_function_bodies.*$/gm, '')
  .replace(/^SET xmloption.*$/gm, '')
  .replace(/^SET client_min_messages.*$/gm, '')
  .replace(/^SET row_security.*$/gm, '')
  .replace(/^SELECT pg_catalog\.set_config.*$/gm, '')
  // Eliminar líneas vacías múltiples
  .replace(/\n\n\n+/g, '\n\n')
  .trim();

// Guardar el SQL limpio
writeFileSync('blocket_clean.sql', cleanedSql, 'utf8');

console.log('✅ SQL limpiado guardado en: blocket_clean.sql');
console.log('📊 Tamaño original:', sqlScript.length, 'bytes');
console.log('📊 Tamaño limpio:', cleanedSql.length, 'bytes');
console.log('\n🚀 Ahora puedes ejecutar:');
console.log('   node init-render-db.js "TU_URL"');
