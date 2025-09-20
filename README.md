# Blocket – Sistema de Solicitudes y Documentos

Este proyecto gestiona la **recepción, asignación y construcción de documentos de respuesta** a solicitudes de clientes.  
Se basa en un modelo flexible que permite registrar, integrar con sistemas externos, asignar responsables y generar documentos dinámicos.

---

## 📂 Estructura de Documentación
- [`docs/recorridos.md`](./docs/recorridos.md): Explica los recorridos del sistema, tanto para ejecutivos como para desarrolladores.
- [`docs/modelo.md`](./docs/modelo.md): Contiene el modelo de datos en **Mermaid ERD**.

---

## 🔹 Recorrido Ejecutivo (resumen)
1. El cliente registra su solicitud.  
2. La solicitud entra al sistema en estado inicial.  
3. La empresa decide si debe integrarse con un sistema externo.  
4. Si no, pasa a la **bandeja de asignación** donde un usuario responsable la toma.  
5. Luego pasa a la **bandeja de construcción**, donde se completan campos dinámicos.  
6. Finalmente, se genera un documento y se envía al cliente.

---

## 🔹 Modelo de Datos (resumen)
El modelo centraliza la información en la tabla **SOLICITUD**, con tablas relacionadas para:
- **Integración externa**
- **Eventos (logs)**
- **Adjuntos**
- **Documentos y bloques dinámicos**

> Para más detalle revisa [`docs/modelo.md`](./docs/modelo.md).
