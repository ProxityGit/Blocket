import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.log("❌ No hay DATABASE_URL definida en el .env");
} else {
    // Ocultar contraseña
    const safeUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
    console.log(`📡 Tu DATABASE_URL apunta a: ${safeUrl}`);

    if (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
        console.log("🏠 Estás usando una base de datos LOCAL (en tu máquina).");
    } else if (dbUrl.includes('render.com')) {
        console.log("☁️ Estás conectado a la base de datos en la NUBE (Render).");
    } else {
        console.log("🌐 Estás conectado a una base de datos REMOTA (otro proveedor).");
    }
}
