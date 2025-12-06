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
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProcess, setEditingProcess] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    is_active: true,
  });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarProcesos();
  }, []);

  const cargarProcesos = async () => {
    try {
      const response = await fetch(apiUrl("/api/processes"));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProcesses(data);
    } catch (error) {
      console.error("Error al cargar procesos:", error);
      alert("Error al cargar procesos. Verifica la conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setEditingProcess(null);
    setFormData({ name: "", is_active: true });
    setShowModal(true);
  };

  const abrirModalEditar = (proceso) => {
    setEditingProcess(proceso);
    setFormData({
      name: proceso.name,
      is_active: proceso.is_active,
    });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingProcess(null);
    setFormData({ name: "", is_active: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("El nombre del proceso es obligatorio");
      return;
    }

    setGuardando(true);

    try {
      const url = apiUrl(
        editingProcess ? `/api/processes/${editingProcess.id}` : "/api/processes"
      );
      const method = editingProcess ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(
          editingProcess
            ? "Proceso actualizado correctamente"
            : "Proceso creado correctamente"
        );
        cerrarModal();
        cargarProcesos();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "No se pudo guardar el proceso"}`);
      }
    } catch (error) {
      console.error("Error al guardar proceso:", error);
      alert("Error al guardar proceso. Verifica la conexión con el servidor.");
    } finally {
      setGuardando(false);
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

  const toggleStatus = async (proceso) => {
    try {
      const response = await fetch(apiUrl(`/api/processes/${proceso.id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: proceso.name,
          is_active: !proceso.is_active,
        }),
      });

      if (response.ok) {
        cargarProcesos();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "No se pudo actualizar el estado"}`);
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("Error al cambiar estado del proceso");
    }
  };

  const processesFiltrados = processes.filter((proceso) => {
    const matchSearch = proceso.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
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
          { label: "Procesos" },
        ]}
      />
      <header className="process-header">
        <div>
          <h1>Gestión de Procesos</h1>
          <p>Administra los procesos de la compañía</p>
        </div>
        <button className="btn-new-process" onClick={abrirModalNuevo}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nuevo Proceso
        </button>
      </header>

      <div className="process-filters">
        <div className="search-box">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
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
            className={`filter-btn ${filterStatus === "inactive" ? "active" : ""
              }`}
            onClick={() => setFilterStatus("inactive")}
          >
            Inactivos ({processes.filter((p) => !p.is_active).length})
          </button>
        </div>
      </div>

      {processesFiltrados.length === 0 ? (
        <div className="empty-state">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6m4.22-13.78l-4.24 4.24m0 6l4.24 4.24M23 12h-6m-6 0H1m13.78-4.22l-4.24 4.24m0 0l-4.24 4.24"></path>
          </svg>
          <h3>No se encontraron procesos</h3>
          <p>Intenta con otros criterios de búsqueda o crea un nuevo proceso</p>
          <button className="btn-primary" onClick={abrirModalNuevo}>
            Crear Primer Proceso
          </button>
        </div>
      ) : (
        <div className="process-list">
          {processesFiltrados.map((proceso) => (
            <div key={proceso.id} className="process-card">
              <div className="process-info">
                <div className="process-header-row">
                  <h3>{proceso.name}</h3>
                  <span
                    className={`status-badge ${proceso.is_active ? "active" : "inactive"
                      }`}
                  >
                    {proceso.is_active ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="process-meta">
                  <span className="meta-item">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
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
                  className="btn-action btn-toggle"
                  onClick={() => toggleStatus(proceso)}
                  title={proceso.is_active ? "Desactivar" : "Activar"}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {proceso.is_active ? (
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                    ) : (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    )}
                  </svg>
                </button>
                <button
                  className="btn-action btn-edit"
                  onClick={() => abrirModalEditar(proceso)}
                  title="Editar"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button
                  className="btn-action btn-delete"
                  onClick={() => eliminarProceso(proceso.id)}
                  title="Eliminar"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para Crear/Editar */}
      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProcess ? "Editar Proceso" : "Nuevo Proceso"}</h2>
              <button className="modal-close" onClick={cerrarModal}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">
                  Nombre del Proceso <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ej: Facturación, Cobranza, Jurídico"
                  required
                  maxLength={100}
                  autoFocus
                />
                <small className="helper-text">
                  Nombre descriptivo del proceso de la compañía
                </small>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">
                    Proceso activo
                    <small>
                      Los procesos inactivos no aparecerán en las opciones de
                      selección
                    </small>
                  </span>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={cerrarModal}
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={guardando}
                >
                  {guardando ? (
                    <>
                      <span className="spinner"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                      </svg>
                      {editingProcess ? "Actualizar" : "Crear Proceso"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
