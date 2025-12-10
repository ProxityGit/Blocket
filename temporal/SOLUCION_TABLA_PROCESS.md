# 🔧 SOLUCIÓN: Sincronizar Estructura de Tabla Process

## 🎯 Problema Identificado

La tabla `process` en Render **NO tiene la columna `updated_at`**, pero el código del backend intenta usarla al crear/actualizar procesos.

**Error actual:**
```
column "updated_at" of relation "process" does not exist
```

---

## ✅ SOLUCIÓN RÁPIDA

### Opción 1: Ejecutar en Render Shell (Recomendado)

1. **Ve a Render Dashboard**
   - Abre: https://dashboard.render.com
   - Selecciona tu base de datos: **blocket-db**

2. **Abre el Shell**
   - Click en la pestaña **"Shell"** (arriba)
   - Espera a que cargue la terminal

3. **Ejecuta estos comandos uno por uno:**

```sql
-- Conectar a la base de datos
psql $DATABASE_URL

-- Agregar columna updated_at
ALTER TABLE process ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- Actualizar registros existentes
UPDATE process SET updated_at = created_at WHERE updated_at IS NULL;

-- Verificar que funcionó
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'process' ORDER BY ordinal_position;

-- Salir
\q
```

4. **Verificar**
   - Deberías ver la columna `updated_at` en la lista
   - Si ves un error "column already exists", significa que ya está agregada ✅

---

### Opción 2: Ejecutar desde pgAdmin (Si ya lo tienes conectado)

1. **Conecta a la base de datos de Render en pgAdmin**
2. **Abre Query Tool**
3. **Copia y pega el contenido de:** `migrations/sync-process-table.sql`
4. **Ejecuta** (F5 o botón Execute)

---

## 🧪 Verificar que Funcionó

Después de ejecutar la migración:

1. **Prueba crear un proceso nuevamente** en tu aplicación
2. **Debería funcionar sin errores** ✅

---

## 📋 Estructura Correcta de la Tabla

Después de la migración, la tabla `process` debería tener:

```
id              bigserial       NOT NULL (PK)
tenant_id       bigint          NOT NULL (FK)
name            text            NOT NULL
description     text            NULL
is_active       boolean         DEFAULT true
created_at      timestamptz     DEFAULT NOW()
updated_at      timestamptz     DEFAULT NOW()  ← NUEVA COLUMNA
```

---

## 🔄 Para Evitar Este Problema en el Futuro

1. **Usa el mismo script de inicialización** en local y en Render
2. **Archivo recomendado:** `blocket_schema.sql`
3. **Mantén sincronizados** los esquemas entre ambientes

---

## 🆘 Si Algo Sale Mal

Si el comando falla o da error:

1. **Verifica que estés conectado** a la base de datos correcta
2. **Revisa los logs** en Render Dashboard → blocket-db → Logs
3. **Contacta** si necesitas ayuda adicional

---

## ✅ Checklist

- [ ] Ejecuté el comando `ALTER TABLE` en Render Shell
- [ ] Vi el mensaje de confirmación
- [ ] Verifiqué que la columna `updated_at` existe
- [ ] Probé crear un proceso y funcionó
- [ ] El error desapareció

---

**¡Listo!** Una vez ejecutado esto, tu aplicación debería funcionar correctamente en Render. 🎉
