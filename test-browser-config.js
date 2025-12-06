// Script de prueba para ejecutar en la consola del navegador
console.log('=== TEST DE CONFIGURACIÓN DEL ENCABEZADO ===');

// 1. Verificar localStorage
const localData = localStorage.getItem('blocket_header_config');
console.log('1. localStorage:', localData ? JSON.parse(localData) : 'No existe');

// 2. Hacer fetch al API
fetch('http://localhost:3000/api/header-config?tenant_id=1')
  .then(res => {
    console.log('2. API Response Status:', res.status);
    return res.json();
  })
  .then(data => {
    console.log('3. API Data:', data);
    
    // 4. Guardar en localStorage
    localStorage.setItem('blocket_header_config', JSON.stringify(data));
    console.log('4. Guardado en localStorage exitoso');
    
    // 5. Verificar guardado
    const saved = localStorage.getItem('blocket_header_config');
    console.log('5. Verificación:', JSON.parse(saved));
    
    console.log('✅ TODO CORRECTO - Recarga la página');
  })
  .catch(err => {
    console.error('❌ ERROR:', err.message);
  });
