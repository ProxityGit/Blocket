```markdown
# Modelo de Datos (ERD)

Este diagrama describe el **modelo de datos en PostgreSQL** que soporta el sistema.

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