# 🚀 PASOS PARA SOLUCIONAR EL PROBLEMA DE RENDER

## 📝 Resumen del Problema
Tu aplicación funciona en local pero no conecta a la base de datos en Render después del deploy.

## ✅ SOLUCIÓN - Sigue estos pasos en orden:

### 1. Hacer Commit de los Cambios Locales

```bash
git add .
git commit -m "Fix: Mejorar configuración de conexión a PostgreSQL para Render"
git push origin main
```

### 2. Configurar Variables de Entorno en Render

Ve a **Render Dashboard** → **blocket-api** → **Environment**

#### Opción A: Usar DATABASE_URL (MÁS FÁCIL - RECOMENDADO)

1. Ve a tu base de datos **blocket-db** en Render
2. Copia la **"External Database URL"** (en la sección Connections)
3. En **blocket-api** → Environment, agrega:
   ```
   DATABASE_URL=postgresql://usuario:password@host:5432/database
   NODE_ENV=production
   ```

#### Opción B: Conectar Automáticamente

1. En **blocket-api** → Environment
2. Click en **"Add from Database"**
3. Selecciona **blocket-db**
4. Render agregará automáticamente: PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD
5. Agrega manualmente:
   ```
   NODE_ENV=production
   ```

### 3. Forzar Redeploy

Después de configurar las variables:

1. Ve a **blocket-api** → **Manual Deploy**
2. Click en **"Clear build cache & deploy"**
3. Espera 2-3 minutos

### 4. Verificar los Logs

Ve a **blocket-api** → **Logs** y busca:

```
🔌 Configuración de base de datos:
  - Modo: production
  - Usando DATABASE_URL: true
✅ Conexión a PostgreSQL establecida
Servidor escuchando en http://localhost:10000
```

### 5. Probar el Health Check

Visita: `https://TU-SERVICIO-api.onrender.com/api/health`

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "...",
  "database": "connected",
  "dbTime": "..."
}
```

## 🧪 Diagnóstico Local (Opcional)

Antes de hacer push, puedes probar localmente:

```bash
npm run db:test
```

Este comando verificará:
- ✅ Variables de entorno configuradas
- ✅ Conexión a la base de datos
- ✅ Tablas existentes
- ✅ Datos de prueba

## 🔧 Si Aún No Funciona

### Problema: "password authentication failed"
**Solución**: La contraseña es incorrecta. Copia nuevamente la DATABASE_URL desde Render.

### Problema: "ECONNREFUSED"
**Solución**: Estás usando la Internal URL en lugar de la External URL.

### Problema: "no pg_hba.conf entry"
**Solución**: Falta SSL. Verifica que `NODE_ENV=production` esté configurado.

### Problema: El servicio no inicia
**Solución**: 
1. Elimina el servicio `blocket-api`
2. Créalo nuevamente
3. Usa "Add from Database" para conectar automáticamente

## 📋 Checklist Final

Antes de continuar, verifica:

- [ ] Hiciste commit y push de los cambios
- [ ] Configuraste DATABASE_URL o variables PG* en Render
- [ ] Configuraste NODE_ENV=production
- [ ] El servicio se redesployó automáticamente
- [ ] Los logs muestran "✅ Conexión a PostgreSQL establecida"
- [ ] El health check responde correctamente

## 🎯 Workflow Correcto

```
Local (desarrollo)
  ↓
git add . && git commit -m "mensaje"
  ↓
git push origin main
  ↓
Render detecta cambio
  ↓
Auto-deploy (2-3 minutos)
  ↓
Verificar logs y health check
  ↓
✅ Listo!
```

## 📞 Archivos Modificados

1. ✅ `db.js` - Mejor manejo de SSL y logging
2. ✅ `package.json` - Script de diagnóstico agregado
3. ✅ `test-db-connection.js` - Nuevo script de diagnóstico
4. ✅ `RENDER_SETUP.md` - Guía detallada de configuración

---

**¡Sigue estos pasos y tu aplicación debería funcionar en Render!** 🚀
