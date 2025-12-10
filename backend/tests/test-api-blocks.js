async function testAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/blocks');
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testAPI();
