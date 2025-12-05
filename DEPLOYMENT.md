# 🚀 Guía de Deployment en Render

Esta guía te ayudará a desplegar **Blocket** en Render.com con PostgreSQL.

---

## 📋 Prerequisitos

1. Cuenta en [Render.com](https://render.com) (gratis)
2. Repositorio en GitHub con el código actualizado
3. Tener el archivo `render.yaml` en la raíz del proyecto

---

## 🔧 Paso 1: Preparar el Repositorio

Asegúrate de que estos archivos estén en tu repo:

- ✅ `render.yaml` - Configuración de servicios
- ✅ `BD_ModelBlocket.sql` - Script de base de datos
- ✅ `scripts/init-db.js` - Inicializador de BD
- ✅ `.gitignore` debe incluir `.env` y `node_modules/`

**Commitear cambios:**
```bash
git add .
git commit -m "Preparar proyecto para Render deployment"
git push origin main
```

---

## 🎯 Paso 2: Crear Servicios en Render

### Opción A: Blueprint (Automático - Recomendado)

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click en **"New +"** → **"Blueprint"**
3. Conecta tu repositorio de GitHub
4. Render detectará `render.yaml` automáticamente
5. Click en **"Apply"**
6. Render creará 3 servicios:
   - `blocket-db` (PostgreSQL)
   - `blocket-api` (Backend)
   - `blocket-frontend` (Frontend estático)

### Opción B: Manual

#### 2.1 Crear Base de Datos PostgreSQL

1. Click **"New +"** → **"PostgreSQL"**
2. Configurar:
   - **Name**: `blocket-db`
   - **Database**: `blocket`
   - **User**: `blocket_user`
   - **Region**: Oregon (US West) - más económico
   - **Plan**: Free
3. Click **"Create Database"**
4. ⏳ Espera 2-3 minutos a que esté disponible

#### 2.2 Inicializar Base de Datos

Una vez creada la BD, ve a la pestaña "Shell" y ejecuta:

```bash
# Descargar el script SQL desde tu repo
curl -O https://raw.githubusercontent.com/TuUsuario/blocket/main/BD_ModelBlocket.sql

# Ejecutar el script
psql $DATABASE_URL -f BD_ModelBlocket.sql
```

O usa el script Node.js desde tu máquina local:
```bash
# Configurar la URL de conexión temporal
export DATABASE_URL="postgresql://user:password@host:port/database"
npm run db:init
```

#### 2.3 Crear Backend (Web Service)

1. Click **"New +"** → **"Web Service"**
2. Conecta tu repositorio
3. Configurar:
   - **Name**: `blocket-api`
   - **Region**: Mismo que la BD
   - **Branch**: `main`
   - **Root Directory**: dejar vacío
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. Variables de entorno (Environment):
   - Click **"Add from Database"** y selecciona `blocket-db`
   - Se agregarán automáticamente: PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD
   - Agregar manualmente:
     - `NODE_ENV` = `production`
     - `PORT` = `10000` (Render lo asigna automáticamente)
5. Click **"Create Web Service"**

#### 2.4 Crear Frontend (Static Site)

1. Click **"New +"** → **"Static Site"**
2. Conecta el mismo repositorio
3. Configurar:
   - **Name**: `blocket-frontend`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Variables de entorno:
   - `VITE_API_URL` = URL del backend (ej: `https://blocket-api.onrender.com`)
5. En **"Redirects/Rewrites"**:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
6. Click **"Create Static Site"**

---

## 🔐 Paso 3: Configurar Variables de Entorno

### En el Backend (`blocket-api`):

```
NODE_ENV=production
PORT=10000
PGHOST=[desde blocket-db]
PGPORT=[desde blocket-db]
PGDATABASE=[desde blocket-db]
PGUSER=[desde blocket-db]
PGPASSWORD=[desde blocket-db]
FRONTEND_URL=https://blocket-frontend.onrender.com
```

### En el Frontend (`blocket-frontend`):

```
VITE_API_URL=https://blocket-api.onrender.com
```

---

## 🧪 Paso 4: Verificar Deployment

1. **Backend**: Visita `https://blocket-api.onrender.com/api/health`
   - Deberías ver: `{"status":"ok","timestamp":"..."}`

2. **Frontend**: Visita `https://blocket-frontend.onrender.com`
   - Deberías ver la página de inicio de Blocket

3. **Base de datos**: Desde Render Shell:
   ```bash
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM customer_request;"
   ```

---

## 🐛 Troubleshooting

### El backend no se conecta a la BD:
- Verifica que las variables `PG*` estén correctas
- Revisa los logs: Dashboard → blocket-api → Logs

### El frontend no puede llamar al backend:
- Verifica que `VITE_API_URL` apunte a la URL correcta del backend
- Asegúrate de hacer rebuild después de cambiar variables de entorno

### Error "502 Bad Gateway":
- El servicio gratuito se "duerme" después de 15 min de inactividad
- Espera 30-60 segundos para que se "despierte"

### Timeout en el deploy:
- El plan gratuito tiene recursos limitados
- Aumenta el timeout en Render Settings si es necesario

---

## 📊 Monitoreo

### Logs en Tiempo Real:
- Dashboard → Servicio → **Logs**

### Métricas:
- Dashboard → Servicio → **Metrics**
- CPU, Memoria, Requests

### Shell Interactivo:
- Dashboard → blocket-db → **Shell**
- Ejecuta queries SQL directamente

---

## 💰 Costos

### Plan Gratuito Incluye:
- ✅ PostgreSQL: 90 días activo (luego se elimina si no hay actividad)
- ✅ Web Service: Sleep después de 15 min de inactividad
- ✅ Static Site: Sin límites
- ✅ 750 horas/mes por servicio

### Para Producción (Upgrade):
- PostgreSQL: $7/mes (1GB RAM, 1GB Storage)
- Web Service: $7/mes (512MB RAM, siempre activo)

---

## 🔄 Actualizaciones Automáticas

Render detecta cambios en tu repo automáticamente:

1. Haces `git push` a `main`
2. Render detecta el cambio
3. Hace rebuild y redeploy automático
4. ✅ Nueva versión en vivo en ~3-5 minutos

---

## 🔗 URLs Finales

Después del deployment tendrás:

- **Frontend**: `https://blocket-frontend.onrender.com`
- **Backend API**: `https://blocket-api.onrender.com`
- **Base de datos**: Conectada internamente

Puedes configurar un dominio personalizado en Render Settings.

---

## 📞 Soporte

- [Documentación Render](https://render.com/docs)
- [Community Forum](https://community.render.com)
- [Status Page](https://status.render.com)

---

¡Listo! 🎉 Tu aplicación Blocket está en la nube.
