# 📄 Blocket – Modelo de Solicitudes y Documentos

Este proyecto gestiona la recepción de solicitudes, su procesamiento, y la generación de documentos de respuesta de manera estructurada y flexible.

---

## 🚀 Recorrido Ejecutivo (Visión de Negocio)

1. **Recepción de Solicitud**  
   - El cliente envía una solicitud por **canales múltiples** (web, correo, WhatsApp, etc.).  
   - Se registran sus datos personales, contacto y mensaje.  
   - La solicitud entra al sistema en un **estado inicial** (ej: *Recibida*).

2. **Registro en Sistemas Externos (opcional)**  
   - Según la configuración del **tenant (empresa)**, la solicitud puede registrarse en un sistema externo (CRM, ERP, Legacy).  
   - Se guarda el identificador externo (radicado, ticket, etc.).

3. **Asignación**  
   - La solicitud aparece en la **bandeja de asignación**.  
   - Un usuario responsable define:  
     - Quién gestionará la solicitud.  
     - Qué **bloques de texto** compondrán la respuesta.  
   - La solicitud cambia de estado a *Asignada*.

4. **Construcción del Documento**  
   - El asignado llena los **campos dinámicos** de los bloques (ej: nombre, fecha, número de factura).  
   - El sistema controla que no existan bloques incompatibles.  
   - El documento se genera en formato formal (ej: PDF).

5. **Notificación al Cliente**  
   - El documento se envía por el canal correspondiente (ej: correo electrónico).  
   - La solicitud queda en estado *Enviada*.  
   - Todo el recorrido queda registrado en una **tabla de eventos (log)**.

---

## 🛠️ Recorrido Técnico (Visión Desarrollador)

1. **Tablas Maestras**  
   - `TENANT`: Empresa propietaria.  
   - `PROCESS`: Procesos asociados al tenant.  
   - `TOPIC`: Temas que agrupan bloques de texto.  
   - `BLOCK`: Bloques de redacción reutilizables con su HTML.  
   - `BLOCK_FIELD`: Campos dinámicos dentro de cada bloque.  
   - `BLOCK_INCOMPATIBILITY`: Define qué bloques no pueden coexistir en un documento.  

2. **Solicitudes**  
   - `SOLICITUD`: Registro maestro con datos del cliente, canal y estado actual.  
   - `SOLICITUD_EVENTO`: Log histórico de eventos (creación, integración, cambios de estado).  
   - `SOLICITUD_ADJUNTO`: Documentos anexos cargados por el cliente.  
   - `SOLICITUD_INTEGRACION`: Relación con sistemas externos (id externo, estado, payload JSON).  

3. **Gestión de Estados**  
   - `ESTADO`: Catálogo de estados de una solicitud (ej: *Recibida, Asignada, En construcción, Enviada*).  
   - `TRANSICION_ESTADO`: Define reglas de paso entre estados (workflow configurable).  

4. **Documentos**  
   - `DOCUMENTO`: Representa la respuesta oficial a una solicitud.  
   - `DOCUMENTO_BLOQUE`: Conecta un documento con los bloques seleccionados y su orden.  
   - `DOCUMENTO_CAMPO_VALOR`: Guarda los valores ingresados en campos dinámicos.  
   - `DOCUMENTO_ENVIO`: Registra los envíos del documento (ej: correo al cliente).  

---

## 📊 Resumen

- **Ejecutivo:** Un cliente hace una solicitud → la empresa la gestiona → se construye y envía un documento → el cliente recibe respuesta formal.  
- **Técnico:** Las tablas permiten trazabilidad completa desde la solicitud hasta el documento enviado, con flexibilidad para distintos procesos y empresas.

---
