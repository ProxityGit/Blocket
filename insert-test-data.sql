-- Insertar solicitudes de prueba
INSERT INTO customer_request (
  tenant_id, channel_id, status_id, customer_name, customer_identifier, 
  tipo_identificacion, email, tipo_cliente, request_type, subject, 
  country, departamento, ciudad, message, created_by
) VALUES
(1, 1, 1, 'Juan Pérez', '12345678', 'CC', 'juan@example.com', 'Natural', 
 'Queja', 'Problema con el servicio', 'Colombia', 'Cundinamarca', 'Bogotá', 
 'Tengo un problema con mi servicio', 'system'),
(1, 2, 2, 'María García', '87654321', 'CC', 'maria@example.com', 'Natural', 
 'Solicitud', 'Información de productos', 'Colombia', 'Antioquia', 'Medellín', 
 'Necesito información sobre los productos', 'system'),
(1, 3, 1, 'Pedro López', '11223344', 'NIT', 'pedro@empresa.com', 'Jurídica', 
 'Reclamo', 'Facturación incorrecta', 'Colombia', 'Valle', 'Cali', 
 'La factura tiene errores', 'system');
