# 🚀 Configuración de Render - Checklist

## ✅ Pasos para Configurar Correctamente

### 1️⃣ **Verificar Variables de Entorno en Render**

Ve a tu servicio `blocket-api` en Render Dashboard y verifica que tengas **UNA** de estas configuraciones:

#### Opción A: Usar DATABASE_URL (Recomendado)
```
DATABASE_URL=postgresql://user:password@host:5432/database
NODE_ENV=production
PORT=10000
```

#### Opción B: Usar Variables Individuales
```
PGHOST=dpg-xxxxx.oregon-postgres.render.com
PGPORT=5432
PGDATABASE=blocket
PGUSER=blocket_user
PGPASSWORD=tu_password_aqui
NODE_ENV=production
PORT=10000
```

### 2️⃣ **Cómo Obtener DATABASE_URL**

1. Ve a tu base de datos `blocket-db` en Render Dashboard
2. En la sección **"Connections"**, copia el valor de **"External Database URL"**
3. Pégalo como variable de entorno `DATABASE_URL` en tu servicio `blocket-api`

**IMPORTANTE**: Usa la **External Database URL**, NO la Internal Database URL

### 3️⃣ **Verificar que el Backend Inicie Correctamente**

Después de configurar las variables:

1. Ve a `blocket-api` → **Logs**
2. Busca estos mensajes:
   ```
   🔌 Configuración de base de datos:
     - Modo: production
     - Usando DATABASE_URL: true
   ✅ Conexión a PostgreSQL establecida
   Servidor escuchando en http://localhost:10000
   ```

3. Si ves errores de conexión, verifica:
   - ✅ La variable `DATABASE_URL` está correctamente copiada
   - ✅ No tiene espacios al inicio o final
   - ✅ Incluye el protocolo `postgresql://`

### 4️⃣ **Probar el Health Check**

Una vez que el servicio esté corriendo:

1. Visita: `https://TU-SERVICIO-api.onrender.com/api/health`
2. Deberías ver:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-12-06T...",
     "database": "connected",
     "dbTime": "2025-12-06T..."
   }
   ```

### 5️⃣ **Comandos para Debugging**

Si el servicio no conecta, usa el Shell de Render:

```bash
# En el servicio blocket-api, ve a Shell y ejecuta:
echo $DATABASE_URL
echo $NODE_ENV
echo $PORT

# Probar conexión directa
node -e "import('pg').then(({default: pkg}) => { const {Pool} = pkg; const pool = new Pool({connectionString: process.env.DATABASE_URL, ssl: {rejectUnauthorized: false}}); pool.query('SELECT NOW()').then(r => console.log('OK:', r.rows[0])).catch(e => console.error('Error:', e)); });"
```

## 🔧 Problemas Comunes

### ❌ Error: "password authentication failed"
**Solución**: La contraseña en `DATABASE_URL` es incorrecta. Cópiala nuevamente desde Render Dashboard.

### ❌ Error: "no pg_hba.conf entry for host"
**Solución**: Falta configuración SSL. Asegúrate de que `NODE_ENV=production` esté configurado.

### ❌ Error: "ECONNREFUSED"
**Solución**: El host o puerto son incorrectos. Verifica que uses la External Database URL.

### ❌ Error: "database does not exist"
**Solución**: El nombre de la base de datos es incorrecto. Verifica en Render Dashboard → blocket-db → Info.

## 📝 Checklist Final

Antes de hacer commit y push:

- [ ] `db.js` tiene el código actualizado con logging
- [ ] Variables de entorno configuradas en Render Dashboard
- [ ] `DATABASE_URL` copiada correctamente (sin espacios)
- [ ] `NODE_ENV=production` configurado
- [ ] Health check responde correctamente
- [ ] Logs muestran "✅ Conexión a PostgreSQL establecida"

## 🔄 Workflow de Desarrollo

1. **Local**: Trabaja con tu `.env` local
2. **Commit**: `git add . && git commit -m "mensaje"`
3. **Push**: `git push origin main`
4. **Render**: Detecta el cambio y hace auto-deploy
5. **Verificar**: Revisa los logs en Render Dashboard

## 🆘 Si Nada Funciona

1. Elimina y recrea el servicio `blocket-api` en Render
2. Asegúrate de conectar la base de datos usando "Add from Database"
3. Render configurará automáticamente todas las variables `PG*`
4. Agrega manualmente solo: `NODE_ENV=production`
