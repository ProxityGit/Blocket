import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { apiUrl } from "../../config/api";
import "./ProcessConfig.css";

export default function ProcessConfig() {
  const navigate = useNavigate();
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive

  useEffect(() => {
    cargarProcesos();
  }, []);

  const cargarProcesos = async () => {
    try {
      const response = await fetch(apiUrl("/api/processes"));
      const data = await response.json();
      setProcesses(data);
    } catch (error) {
      console.error("Error al cargar procesos:", error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarProceso = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este proceso?")) return;

    try {
      const response = await fetch(apiUrl(`/api/processes/${id}`), {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Proceso eliminado correctamente");
        cargarProcesos();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "No se pudo eliminar el proceso"}`);
      }
    } catch (error) {
      console.error("Error al eliminar proceso:", error);
      alert("Error al eliminar proceso");
    }
  };

  const processesFiltrados = processes.filter((proceso) => {
    const matchSearch = proceso.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && proceso.is_active) ||
      (filterStatus === "inactive" && !proceso.is_active);
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="process-config-container">
        <div className="loading-spinner">Cargando procesos...</div>
      </div>
    );
  }

  return (
    <div className="process-config-container">
      <Breadcrumbs 
        items={[
          { label: "Configuración", path: "/configuracion" },
          { label: "Procesos" }
        ]}
      />
      <header className="process-header">
        <div>
          <h1>Gestión de Procesos</h1>
          <p>Administra los procesos de la compañía</p>
        </div>
        <button className="btn-new-process" onClick={() => navigate("/configuracion/procesos/nuevo")}>
          + Nuevo Proceso
        </button>
      </header>

      <div className="process-filters">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            Todos ({processes.length})
          </button>
          <button
            className={`filter-btn ${filterStatus === "active" ? "active" : ""}`}
            onClick={() => setFilterStatus("active")}
          >
            Activos ({processes.filter((p) => p.is_active).length})
          </button>
          <button
            className={`filter-btn ${filterStatus === "inactive" ? "active" : ""}`}
            onClick={() => setFilterStatus("inactive")}
          >
            Inactivos ({processes.filter((p) => !p.is_active).length})
          </button>
        </div>
      </div>

      {processesFiltrados.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6m4.22-13.78l-4.24 4.24m0 6l4.24 4.24M23 12h-6m-6 0H1m13.78-4.22l-4.24 4.24m0 0l-4.24 4.24"></path>
          </svg>
          <h3>No se encontraron procesos</h3>
          <p>Intenta con otros criterios de búsqueda o crea un nuevo proceso</p>
        </div>
      ) : (
        <div className="process-list">
          {processesFiltrados.map((proceso) => (
            <div key={proceso.id} className="process-card">
              <div className="process-info">
                <div className="process-header-row">
                  <h3>{proceso.name}</h3>
                  <span className={`status-badge ${proceso.is_active ? "active" : "inactive"}`}>
                    {proceso.is_active ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="process-meta">
                  <span className="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ID: {proceso.id}
                  </span>
                  {proceso.created_at && (
                    <span className="meta-item">
                      Creado: {new Date(proceso.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="process-actions">
                <button
                  className="btn-action btn-edit"
                  onClick={() => navigate(`/configuracion/procesos/${proceso.id}`)}
                  title="Editar"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Editar
                </button>
                <button
                  className="btn-action btn-delete"
                  onClick={() => eliminarProceso(proceso.id)}
                  title="Eliminar"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
