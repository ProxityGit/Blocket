// Test para verificar los endpoints de header-config
const API_URL = 'http://localhost:3000/api';

async function testHeaderConfigEndpoints() {
  console.log('🧪 Probando endpoints de header-config...\n');

  try {
    // 1. GET - Obtener configuración actual
    console.log('1️⃣ GET /api/header-config');
    const getResponse = await fetch(`${API_URL}/header-config?tenant_id=1`);
    const currentConfig = await getResponse.json();
    console.log('✅ Configuración actual:', currentConfig);
    console.log('');

    // 2. POST - Actualizar configuración
    console.log('2️⃣ POST /api/header-config');
    const newConfig = {
      tenant_id: 1,
      logo_url: 'https://example.com/logo.png',
      company_name: 'EnerGAS S.A.S',
      address: 'Calle 45 #21-30',
      city: 'Santiago de Cali',
      greeting: 'Cordial saludo:',
      radicado_label: 'N° Radicado',
      identificador_label: 'Cédula',
      show_radicado: true,
      show_identificador: true
    };

    const postResponse = await fetch(`${API_URL}/header-config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newConfig)
    });
    const savedConfig = await postResponse.json();
    console.log('✅ Configuración guardada:', savedConfig);
    console.log('');

    // 3. GET - Verificar que se guardó correctamente
    console.log('3️⃣ GET /api/header-config (verificar guardado)');
    const verifyResponse = await fetch(`${API_URL}/header-config?tenant_id=1`);
    const verifiedConfig = await verifyResponse.json();
    console.log('✅ Configuración verificada:', verifiedConfig);
    console.log('');

    console.log('✨ Todos los tests pasaron exitosamente!');

  } catch (error) {
    console.error('❌ Error en los tests:', error.message);
  }
}

testHeaderConfigEndpoints();
