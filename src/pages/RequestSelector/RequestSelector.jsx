import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RequestSelector.css";

export default function RequestSelector() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");

  const solicitudes = [
    {
      id: 4587,
      nombre: "Activación de Producto",
      cliente: "Pepito Pérez",
      identificacion: "123456789",
      tipoCliente: "Residencial",
      tipoSolicitud: "Activación",
      fecha: "2025-10-19",
      radicado: "RAD-2025-001",
    },
    {
      id: 4588,
      nombre: "Cambio de Información",
      cliente: "Ana Gómez",
      identificacion: "998877665",
      tipoCliente: "Comercial",
      tipoSolicitud: "Actualización de datos",
      fecha: "2025-10-22",
      radicado: "RAD-2025-002",
    },
    {
      id: 4589,
      nombre: "Aviso de Mora",
      cliente: "Carlos Rojas",
      identificacion: "112233445",
      tipoCliente: "Residencial",
      tipoSolicitud: "Reclamación",
      fecha: "2025-10-24",
      radicado: "RAD-2025-003",
    },
  ];

  const filtradas = solicitudes.filter(
    (s) =>
      (filtroTipo === "Todos" || s.tipoSolicitud === filtroTipo) &&
      (s.cliente.toLowerCase().includes(search.toLowerCase()) ||
        s.radicado.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="requests-container-extended">
      {/* ===== Encabezado ===== */}
      <header className="requests-header-extended">
        <div className="header-left">
          <h1>📋 Solicitudes Registradas</h1>
          
        </div>
      </header>

      {/* ===== Filtros fuera del encabezado ===== */}
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
        <span>Tipo Cliente</span>
        <span>Tipo Solicitud</span>
        <span>Radicado</span>
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
            <span className="fecha">{new Date(s.fecha).toLocaleDateString()}</span>
            <span className="cliente">{s.cliente}</span>
            <span className="identificacion">{s.identificacion}</span>
            <span className="tipo-cliente">{s.tipoCliente}</span>
            <span className="tipo-solicitud">
              <span
                className={`pill ${
                  s.tipoSolicitud.includes("Reclamación")
                    ? "pill-red"
                    : s.tipoSolicitud.includes("Actualización")
                    ? "pill-blue"
                    : "pill-green"
                }`}
              >
                {s.tipoSolicitud}
              </span>
            </span>
            <span className="radicado">{s.radicado}</span>
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
