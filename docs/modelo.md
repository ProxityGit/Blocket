# Modelo de Datos

Este modelo describe cómo se organiza la información de **solicitudes** y la construcción de **documentos dinámicos**.  
El diseño es flexible para adaptarse a distintas empresas (**tenants**) y soporta integraciones con sistemas externos, adjuntos, eventos (logs) y bloques de contenido configurables.

---

## 🔹 Visión General (ejecutivo)
- Cada **Tenant (empresa)** administra sus propios procesos, temas y solicitudes.  
- Una **Solicitud** es el núcleo: puede recibir adjuntos, integrarse con sistemas externos y registrar eventos.  
- Los **Documentos** se construyen a partir de **Bloques** y **Campos dinámicos**.  
- Todo el flujo queda trazado mediante estados y logs.

---

## 🔹 Modelo ERD en Mermaid

```mermaid
erDiagram
  TENANT ||--o{ PROCESS : "1 a n"
  TENANT ||--o{ TOPIC : "1 a n"
  TENANT ||--o{ SOLICITUD : "1 a n"

  PROCESS ||--|| TOPIC : "1 a 1"
  TOPIC ||--o{ BLOCK : "1 a n"
  CATEGORY ||--o{ BLOCK : "1 a n (opcional)"
  BLOCK ||--o{ BLOCK_FIELD : "1 a n"
  BLOCK ||--o{ BLOCK_INCOMPATIBILITY : "1 a n"

  SOLICITUD ||--o{ SOLICITUD_INTEGRACION : "0..n"
  SOLICITUD ||--o{ SOLICITUD_ADJUNTOS : "0..n"
  SOLICITUD ||--o{ SOLICITUD_EVENTO : "0..n"
  SOLICITUD ||--o{ DOCUMENTO : "0..n"

  DOCUMENTO ||--o{ DOCUMENTO_BLOQUE : "1 a n"
  DOCUMENTO ||--o{ DOCUMENTO_CAMPO_VALOR : "1 a n"
  DOCUMENTO ||--o{ DOCUMENTO_ENVIO : "0..n"

  TENANT {
    bigint id PK
    text   nombre
    boolean activo
    timestamptz creado_en
  }

  SOLICITUD {
    bigint id PK
    bigint tenant_id FK
    bigint canal_id FK
    bigint estado_id FK
    text   radicado_local
    text   nombre_cliente
    text   apellidos_cliente
    text   email
    text   mensaje
    jsonb  carga_json
    timestamptz creado_en
    text   creado_por
  }

  DOCUMENTO {
    bigint id PK
    bigint solicitud_id FK
    text   titulo
    text   estado_documento "borrador/en_revision/aprobado/enviado"
    timestamptz creado_en
    text   creado_por
    timestamptz actualizado_en
    text   actualizado_por
  }
