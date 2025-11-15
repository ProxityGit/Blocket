// Script para probar el endpoint de bloques
async function testBlocksEndpoint() {
  console.log('🧪 Probando endpoint GET /api/blocks\n');

  try {
    const response = await fetch('http://localhost:3000/api/blocks');
    const data = await response.json();

    console.log(`✅ Status: ${response.status}`);
    console.log(`📦 Total de bloques: ${data.length}\n`);

    data.forEach((block, index) => {
      console.log(`\n${index + 1}. ${block.titulo}`);
      console.log(`   ID: ${block.id}`);
      console.log(`   Key: ${block.key}`);
      console.log(`   Proceso: ${block.proceso || 'N/A'}`);
      console.log(`   Causal: ${block.causal || 'N/A'}`);
      console.log(`   Campos dinámicos: ${block.campos?.length || 0}`);
      
      if (block.campos && block.campos.length > 0) {
        block.campos.forEach(campo => {
          console.log(`      - ${campo.name} (${campo.type}): ${campo.label}`);
        });
      }
    });

    console.log('\n\n🧪 Probando endpoint GET /api/blocks/7\n');
    
    const singleResponse = await fetch('http://localhost:3000/api/blocks/7');
    const singleBlock = await singleResponse.json();

    console.log(`✅ Status: ${singleResponse.status}`);
    console.log(`📦 Bloque: ${singleBlock.titulo}`);
    console.log(`   Campos: ${singleBlock.campos?.length || 0}`);
    console.log('\n📝 Template HTML (primeros 200 caracteres):');
    console.log(singleBlock.texto?.substring(0, 200) + '...');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testBlocksEndpoint();
