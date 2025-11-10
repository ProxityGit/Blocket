import "./LetterHeader.css";

function LetterHeader({ header }) {
  // Formatear fecha si es tipo Date o string ISO
  let fechaFormateada = header.fecha;
  if (header.fecha) {
    try {
      const fechaObj = new Date(header.fecha);
      if (!isNaN(fechaObj)) {
        fechaFormateada = `Santiago de Cali, ${fechaObj.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })}`;
      }
    } catch {}
  }
  return (
    <div className="letter-header">
      {/* 🔹 Membrete superior de empresa */}
      <div className="letter-company">
        {header.logo && (
          <img src={header.logo} alt="Logo empresa" className="letter-logo" />
        )}
        <div>
          <h2 className="letter-company-name">{header.nombreEmpresa}</h2>
          <p className="letter-company-info">{header.direccion}</p>
        </div>
      </div>

      <hr className="letter-divider" />

      {/* 🔹 Encabezado de la carta */}
      <div className="letter-meta">
        <p  className="letter-date">{fechaFormateada}</p><br></br>
        <p><strong>{header.destinatario}:</strong> </p>
        {header.identificacion && (
          <p>Identificación: {header.identificacion}</p>
        )}
        <p>Dirección: correo@correo.com.co</p>
        <p>Radicado: {header.radicado}</p><br></br>
        <p>Asunto: {header.asunto}</p>
      </div>

      {/* 🔹 Saludo */}
      <div className="letter-saludo">
        <p>{header.saludo}</p>
      </div>
    </div>
  );
}

export default LetterHeader;
