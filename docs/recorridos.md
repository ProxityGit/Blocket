# Recorridos del Sistema

## Recorrido Ejecutivo
Este recorrido explica el modelo a un directivo o ejecutivo, en términos simples y de negocio.

```mermaid
flowchart LR
    A[Cliente registra solicitud] --> B[Solicitud entra a la tabla SOLICITUD]
    B --> C[Definición de si debe integrarse a sistema externo]
    C -->|Sí| D[Tabla SOLICITUD_INTEGRACION]
    C -->|No| E[Avanza a estación de Asignación]
    E --> F[Usuario asigna responsable y bloques de respuesta]
    F --> G[Estación de Construcción del Documento]
    G --> H[Documento se envía al cliente]