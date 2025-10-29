import "./LetterHeader.css";

function LetterHeader({ header }) {
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
        <p className="letter-date">{header.fecha}</p>   <p><br></br></p>
        <p><strong>Señor(a):</strong> {header.destinatario}</p>
        <p><strong>Radicado:</strong> {header.radicado}</p><p><br></br></p>
        <p><strong>Asunto:</strong> {header.asunto}</p>
      </div>

      {/* 🔹 Saludo */}
      <div className="letter-saludo">
        <p>{header.saludo}</p>
      </div>
    </div>
  );
}

export default LetterHeader;
