//src/data/mockBlocks.js
//descripción: Datos simulados de bloques de documentos con plantillas y campos dinámicos.

export const BLOQUES = [
  {
    id: 1,
    titulo: "Carta de bienvenida",
    proceso: "Onboarding",
    causal: "Nuevo Cliente",
    tipo: "Informativo",
    texto: `
      
          A continuación, encontrará los detalles de su registro {{fechaInicio}}: sss<br>
          
      <table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">
        <tr>
          <th>Servicio</th>
          <th>Inicio</th>
          <th>Estado</th>
        </tr>
          <tr><td>Plan Básico</td>
          <td>{{fechaInicio}}</td>
          <td>Activo</td>
        </tr>
      </table>
      
      <br>
      <img src="https://img.icons8.com/ios/100/737373/online-payment-.png" alt="Imagen de prueba"/><br><br>
      Gracias por elegirnos.
    `,
    campos: [
      { name: "nombreCliente", label: "Nombre del cliente", type: "text" },
      { name: "fechaInicio", label: "Fecha de inicio", type: "date" },
    ],
  },


 
{
  "id": 2,
  "titulo": "Aviso de Mora",
  "proceso": "Cobranza",
  "causal": "Incumplimiento",
  "tipo": "Advertencia",
  "texto": "<p>Hemos detectado que su préstamo número {{numeroPrestamo}} se encuentra actualmente en estado de mora. Al cierre de la fecha de corte, el saldo vencido acumula un retraso de <span style='color: #d32f2f; font-weight: bold;'>{{diasMora}} días</span>.</p><br><p><b>¿Qué significa esto para usted?</b></p><ul><li>Posibles cargos financieros adicionales</li><li>Afectación a su historial crediticio</li><li>Inclusión en centrales de riesgo</li></ul><br><p>Le recomendamos regularizar su situación de inmediato a través de nuestros canales oficiales:</p><table border='1' style='border-collapse: collapse; width: 100%;'><tr><th>Canal</th><th>Disponibilidad</th></tr><tr><td>App Bancaria</td><td>24/7</td></tr><tr><td>Línea de Atención</td><td>Lun-Vie 8am-6pm</td></tr><tr><td>Oficinas</td><td>Lun-Vie 9am-4pm</td></tr></table><br><p>Si enfrenta dificultades financieras, nuestro equipo de asesores está disponible para ayudarle.</p>",
  "campos": [
    { "name": "nombreCliente", "label": "Nombre del cliente", "type": "text" },
    { "name": "numeroPrestamo", "label": "Número de préstamo", "type": "text" },
    { "name": "diasMora", "label": "Días de mora", "type": "number" }
  ]
},

{
  "id": 3,
  "titulo": "Confirmación de Pago",
  "proceso": "Transacciones",
  "causal": "Pago",
  "tipo": "Informativo",
  "texto": "<div style='text-align: center;'><img src='https://img.icons8.com/ios/100/737373/online-payment-.png' alt='Pago Confirmado' width='80' height='80'></div><h3 style='color: #2e7d32; text-align: center;'>¡Pago Confirmado Exitosamente!</h3><p>Estimado cliente,</p><p>Hemos procesado su transacción por <b>${{monto}}</b> realizada el <i>{{fechaPago}}</i>.</p><br><table border='1' style='border-collapse: collapse; width: 100%; background-color: #f9f9f9;'><tr><td><b>Estado:</b></td><td style='color: #2e7d32; font-weight: bold;'>COMPLETADO</td></tr><tr><td><b>Monto:</b></td><td>${{monto}}</td></tr><tr><td><b>Fecha:</b></td><td>{{fechaPago}}</td></tr><tr><td><b>Referencia:</b></td><td>PAGO-{{numeroPrestamo}}</td></tr></table><br><p><b>Próximos pasos:</b></p><ul><li>Recibirá un comprobante por correo electrónico</li><li>Su saldo se actualizará en las próximas 2 horas</li><li>Conserve este número de referencia</li></ul><br><p style='font-size: 12px; color: #666;'>Si no reconoce esta transacción, contacte inmediatamente a nuestro centro de seguridad.</p>",
  "campos": [
    { "name": "monto", "label": "Monto pagado", "type": "number" },
    { "name": "fechaPago", "label": "Fecha de pago", "type": "date" }
  ]
},


{
  "id": 4,
  "titulo": "Activación de Producto",
  "proceso": "Onboarding",
  "causal": "Nuevo Producto",
  "tipo": "Informativo",  
  "texto": "<p>Felicitaciones <b>{{nombreCliente}}</b>, su <b>{{tipoProducto}}</b> ha sido activado exitosamente. El número de cuenta asignado es <b>{{numeroCuenta}}</b> y ya se encuentra disponible para uso inmediato.</p><p>Puede acceder a todos los beneficios y características de su nuevo producto a través de nuestra plataforma digital. Recibirá su tarjeta física y contraseñas en la dirección registrada dentro de los próximos 5 días hábiles.</p>",
  "campos": [
    { "name": "nombreCliente", "label": "Nombre del cliente", "type": "text" },
    { "name": "tipoProducto", "label": "Tipo de producto", "type": "text" },
    { "name": "numeroCuenta", "label": "Número de cuenta", "type": "text" }
  ]
},


{
  "id": 5,
  "titulo": "Cambio de Información",
   "proceso": "Atención Cliente",
  "causal": "Actualización",
  "tipo": "Confirmación",
  "texto": "<p>Le confirmamos que su solicitud de actualización de <b>{{tipoInformacion}}</b> ha sido procesada correctamente. Los cambios solicitados se han aplicado en nuestros sistemas a partir de <b>{{fechaCambio}}</b>.</p><p>Recibirá una notificación por correo electrónico confirmando la modificación. Si no reconoce esta acción o necesita realizar ajustes adicionales, contáctenos dentro de las próximas 48 horas.</p>",
  "campos": [
    { "name": "tipoInformacion", "label": "Tipo de información", "type": "text" },
    { "name": "fechaCambio", "label": "Fecha de cambio", "type": "date" }
  ]
},


];
