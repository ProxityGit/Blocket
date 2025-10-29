//src/data/mockBlocks.js
//descripción: Datos simulados de bloques de documentos con plantillas y campos dinámicos.

export const BLOQUES = [
    {
    id: 1,
    titulo: "Carta de Bienvenida",
    proceso: "Onboarding",
    causal: "Nuevo Cliente",
    tipo: "Informativo",
    texto: `
    
      <p>Nos complace darle la bienvenida a nuestra comunidad. A partir del <b>{{fechaInicio}}</b>, podrá disfrutar de todos los servicios y beneficios asociados a su registro.</p>
      <p>Esperamos que esta nueva experiencia supere sus expectativas y le brinde comodidad y confianza.</p>
    `,
    campos: [
      { name: "nombreCliente", label: "Nombre del cliente", type: "text" },
      { name: "fechaInicio", label: "Fecha de inicio", type: "date" },
    ],
  },


 
{
    id: 2,
    titulo: "Aviso de Actualización de Políticas",
    proceso: "Cumplimiento",
    causal: "Actualización Legal",
    tipo: "Informativo",
    texto: `
      <p>Queremos informarle que a partir del <b>{{fechaVigencia}}</b> entra en vigor una actualización en nuestras políticas de servicio.</p>
      <p>Le recomendamos revisar los nuevos términos en nuestro portal para garantizar que esté al tanto de los cambios implementados.</p>
      <p>Esta actualización refuerza nuestro compromiso con la transparencia y la protección de los datos de nuestros clientes.</p>
    `,
    campos: [
      { name: "fechaVigencia", label: "Fecha de vigencia", type: "date" },
    ],
  },

{
    id: 3,
    titulo: "Confirmación de Cita",
    proceso: "Atención al Cliente",
    causal: "Solicitud Agendada",
    tipo: "Confirmación",
    texto: `

      <p>Le confirmamos su cita programada para el día <b>{{fechaCita}}</b> a las <b>{{horaCita}}</b>.</p>
      <p>El encuentro tendrá lugar en nuestras oficinas principales o por el canal que haya seleccionado previamente.</p>
      <p>Por favor llegue con 10 minutos de anticipación.</p>
    `,
    campos: [
      { name: "nombreCliente", label: "Nombre del cliente", type: "text" },
      { name: "fechaCita", label: "Fecha de la cita", type: "date" },
      { name: "horaCita", label: "Hora de la cita", type: "text" },
    ],
  },


{
    id: 4,
    titulo: "Resumen de Transacciones",
    proceso: "Finanzas",
    causal: "Cierre de Mes",
    tipo: "Reporte",
    texto: `
     
      <p>A continuación encontrará un resumen de sus transacciones registradas durante el periodo <b>{{periodo}}</b>.</p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <tr style="background-color:#f2f4f7;">
          <th>Fecha</th>
          <th>Descripción</th>
          <th>Monto</th>
        </tr>
        <tr>
          <td>{{fecha1}}</td>
          <td>{{descripcion1}}</td>
          <td>{{monto1}}</td>
        </tr>
        <tr>
          <td>{{fecha2}}</td>
          <td>{{descripcion2}}</td>
          <td>{{monto2}}</td>
        </tr>
      </table>
      <br>
      <p><b>Total del periodo:</b> {{total}}</p>
      <p style="font-size:12px; color:#666;">* Este documento tiene carácter informativo y no reemplaza los extractos oficiales.</p>
    `,
    campos: [
      { name: "nombreCliente", label: "Nombre del cliente", type: "text" },
      { name: "periodo", label: "Periodo de reporte", type: "text" },
      { name: "fecha1", label: "Fecha 1", type: "date" },
      { name: "descripcion1", label: "Descripción 1", type: "text" },
      { name: "monto1", label: "Monto 1", type: "number" },
      { name: "fecha2", label: "Fecha 2", type: "date" },
      { name: "descripcion2", label: "Descripción 2", type: "text" },
      { name: "monto2", label: "Monto 2", type: "number" },
      { name: "total", label: "Total", type: "number" },
    ],
  },


{
    id: 5,
    titulo: "Informe de Evaluación de Servicio",
    proceso: "Satisfacción Cliente",
    causal: "Retroalimentación",
    tipo: "Evaluación",
    texto: `
      <h3 style="color:#1976d2;">Evaluación de Servicio Reciente</h3>
      <p>Cliente: <b>{{nombreCliente}}</b></p>
      <p>Fecha de atención: <b>{{fechaAtencion}}</b></p>
      <p>Asesor encargado: <b>{{nombreAsesor}}</b></p>
      <br>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <tr style="background-color:#eaf3ff;">
          <th>Criterio</th>
          <th>Calificación (1-5)</th>
        </tr>
        <tr>
          <td>Rapidez</td>
          <td>{{puntajeRapidez}}</td>
        </tr>
        <tr>
          <td>Amabilidad</td>
          <td>{{puntajeAmabilidad}}</td>
        </tr>
        <tr>
          <td>Resolución del problema</td>
          <td>{{puntajeResolucion}}</td>
        </tr>
      </table>
      <br>
      <p>Comentarios adicionales: {{comentarios}}</p>
      <img src="https://img.icons8.com/fluency/96/customer-support.png" alt="Atención al cliente" width="90"/><br>
      <p style="font-size: 12px; color: #555;">Gracias por ayudarnos a mejorar continuamente nuestros servicios.</p>
    `,
    campos: [
      { name: "nombreCliente", label: "Nombre del cliente", type: "text" },
      { name: "fechaAtencion", label: "Fecha de atención", type: "date" },
      { name: "nombreAsesor", label: "Nombre del asesor", type: "text" },
      { name: "puntajeRapidez", label: "Puntaje de rapidez", type: "number" },
      { name: "puntajeAmabilidad", label: "Puntaje de amabilidad", type: "number" },
      { name: "puntajeResolucion", label: "Puntaje de resolución", type: "number" },
      { name: "comentarios", label: "Comentarios", type: "text" },
    ],
  },
];