import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../../config/api";
import "./ProcessConfig.css";

export default function ProcessForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = !!id;

  const [formData, setFormData] = useState({
    name: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (esEdicion) {
      cargarProceso();
    }
  }, [id]);

  const cargarProceso = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl(`/api/processes/${id}`));
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || "",
          is_active: data.is_active ?? true,
        });
      } else {
        alert("Error al cargar el proceso");
        navigate("/configuracion/procesos");
      }
    } catch (error) {
      console.error("Error al cargar proceso:", error);
      alert("Error al cargar proceso");
      navigate("/configuracion/procesos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("El nombre del proceso es obligatorio");
      return;
    }

    setGuardando(true);

    try {
      const url = apiUrl(esEdicion
        ? `/api/processes/${id}`
        : "/api/processes");
      const method = esEdicion ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(esEdicion ? "Proceso actualizado correctamente" : "Proceso creado correctamente");
        navigate("/configuracion/procesos");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "No se pudo guardar el proceso"}`);
      }
    } catch (error) {
      console.error("Error al guardar proceso:", error);
      alert("Error al guardar proceso");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="process-form-container">
        <div className="loading-spinner">Cargando proceso...</div>
      </div>
    );
  }

  return (
    <div className="process-form-container">
      <div className="form-header">
        <button className="btn-back" onClick={() => navigate("/configuracion/procesos")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver a Procesos
        </button>
        <h1>{esEdicion ? "Editar Proceso" : "Nuevo Proceso"}</h1>
        <p>
          {esEdicion
            ? "Modifica la información del proceso existente"
            : "Completa los datos para crear un nuevo proceso"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="process-form">
        <div className="form-section">
          <h3>Información del Proceso</h3>

          <div className="form-group">
            <label htmlFor="name">
              Nombre del Proceso <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Cobranza, Jurídico, Comercial"
              required
              maxLength={100}
            />
            <small className="helper-text">Nombre descriptivo del proceso de la compañía</small>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">
                Proceso activo
                <small>Los procesos inactivos no aparecerán en las opciones de selección</small>
              </span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/configuracion/procesos")}
            disabled={guardando}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-submit" disabled={guardando}>
            {guardando ? (
              <>
                <span className="spinner"></span>
                Guardando...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                {esEdicion ? "Actualizar Proceso" : "Crear Proceso"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
