import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RequestSelector.css";

export default function RequestSelector() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/requests")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener solicitudes");
        return res.json();
      })
      .then((data) => {
        setSolicitudes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtradas = solicitudes.filter(
    (s) =>
      (filtroTipo === "Todos" || (s.request_type && s.request_type === filtroTipo)) &&
      (
        (s.customer_name && s.customer_name.toLowerCase().includes(search.toLowerCase())) ||
        (s.subject && s.subject.toLowerCase().includes(search.toLowerCase()))
      )
  );

  return (
    <div className="requests-container-extended">
      {/* ===== Encabezado ===== */}
      <header className="requests-header-extended">
        <div className="header-left">
          <h1>📋 Solicitudes Registradas</h1>
        </div>
      </header>

      {/* Estado de carga y error */}
      {loading && <div style={{textAlign:'center',margin:'32px'}}>Cargando solicitudes...</div>}
      {error && <div style={{color:'red',textAlign:'center',margin:'32px'}}>Error: {error}</div>}
      <div className="filter-bar outside">
        <input
          type="text"
          placeholder="🔍 Buscar por cliente o radicado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="Todos">Todos</option>
          <option value="Activación">Activación</option>
          <option value="Actualización de datos">Actualización de datos</option>
          <option value="Reclamación">Reclamación</option>
        </select>
        <button className="btn-new">➕ Nueva solicitud</button>
      </div>

      <p>
            Selecciona una solicitud para abrir el constructor de documentos y
            gestionar la información asociada.
          </p>

      {/* ===== Cabecera de tabla ===== */}
      <div className="requests-table-header">
        <span>Fecha</span>
        <span>Cliente</span>
        <span>Identificación</span>
        <span>Tipo Solicitud</span>
        <span>Asunto</span>
        <span></span>
      </div>

      {/* ===== Listado ===== */}
      <div className="requests-list">
        {filtradas.map((s) => (
          <div
            key={s.id}
            className="request-row"
            onClick={() => navigate(`/constructor/${s.id}`)}
          >
            <span className="fecha">{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</span>
            <span className="cliente">{s.customer_name || "—"}</span>
            <span className="identificacion">{s.customer_identifier || "—"}</span>
            <span className="tipo-solicitud">
              <span
                className={`pill ${(() => {
                  const type = s.request_type ? s.request_type.toLowerCase() : "";
                  if (type.includes("claim") || type.includes("reclamo") || type.includes("queja")) return "pill-red";
                  if (type.includes("update") || type.includes("actualizacion")) return "pill-blue";
                  if (type.includes("activation") || type.includes("solicitud")) return "pill-green";
                  return "pill-blue"; // color por defecto
                })()}`}
              >
                {s.request_type || "—"}
              </span>
            </span>
            <span className="asunto">{s.subject || "—"}</span>
            <span className="accion">➡️</span>
          </div>
        ))}

        {filtradas.length === 0 && (
          <div className="empty-state">
            <p>⚪ No hay solicitudes que coincidan con los filtros actuales.</p>
          </div>
        )}
      </div>
    </div>
  );
}
