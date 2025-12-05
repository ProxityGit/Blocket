import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BlockConfig.css";
import { apiUrl } from "../../config/api";

export default function BlockConfig() {
  const navigate = useNavigate();
  const [bloques, setBloques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProcess, setFilterProcess] = useState("");

  useEffect(() => {
    cargarBloques();
  }, []);

  useEffect(() => {
    // Agregar event listener para ajustar posición de modales
    const handleMouseEnter = (e) => {
      const preview = e.currentTarget;
      const modal = preview.querySelector('.preview-modal');
      if (!modal) return;

      const rect = preview.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Si hay más espacio arriba que abajo, mostrar arriba
      if (spaceBelow < 450 && spaceAbove > spaceBelow) {
        modal.classList.add('modal-above');
      } else {
        modal.classList.remove('modal-above');
      }
    };

    // Agregar event listeners después de que los bloques se carguen
    const previews = document.querySelectorAll('.block-preview');
    previews.forEach(preview => {
      preview.addEventListener('mouseenter', handleMouseEnter);
    });

    return () => {
      previews.forEach(preview => {
        preview.removeEventListener('mouseenter', handleMouseEnter);
      });
    };
  }, [bloques]);

  const cargarBloques = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/blocks'));
      if (!res.ok) throw new Error("Error al cargar bloques");
      const data = await res.json();
      setBloques(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarBloque = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este bloque?")) return;
    
    try {
      const res = await fetch(apiUrl(`/api/blocks/${id}`), { method: 'DELETE' });
      if (!res.ok) throw new Error("Error al eliminar bloque");
      cargarBloques();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const bloquesFiltrados = bloques.filter(b => {
    const matchSearch = b.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.key?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchProcess = !filterProcess || b.proceso === filterProcess;
    return matchSearch && matchProcess;
  });

  const procesos = [...new Set(bloques.map(b => b.proceso).filter(Boolean))];

  return (
    <div className="block-config-container">
      <header className="block-config-header">
        <div>
          <button className="btn-back" onClick={() => navigate("/")}>
            ← Volver
          </button>
          <h1>⚙️ Configuración de Bloques</h1>
          <p>Gestiona los bloques de texto y sus campos dinámicos</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => navigate("/config/bloques/nuevo")}
        >
          ➕ Nuevo Bloque
        </button>
      </header>

      <div className="block-config-content">
        <div className="filters-bar">
          <input
            type="text"
            placeholder="🔍 Buscar por título o key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterProcess}
            onChange={(e) => setFilterProcess(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los procesos</option>
            {procesos.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="loading-state">Cargando bloques...</div>
        )}

        {error && (
          <div className="error-state">Error: {error}</div>
        )}

        {!loading && !error && bloquesFiltrados.length === 0 && (
          <div className="empty-state">
            <p>No se encontraron bloques</p>
            <button 
              className="btn-primary"
              onClick={() => navigate("/config/bloques/nuevo")}
            >
              Crear primer bloque
            </button>
          </div>
        )}

        {!loading && !error && bloquesFiltrados.length > 0 && (
          <div className="blocks-grid">
            {bloquesFiltrados.map(bloque => (
              <div key={bloque.id} className="block-card">
                <div className="block-card-header">
                  <div className="header-left">
                    <h3>{bloque.titulo}</h3>
                    <span className="block-key">{bloque.key}</span>
                  </div>
                  <div className="block-status">
                    <span className={`status-badge ${bloque.is_active ? 'active' : 'inactive'}`}>
                      {bloque.is_active ? '✓' : '○'}
                    </span>
                  </div>
                </div>
                
                <div className="block-card-body">
                  <div className="block-meta">
                    <span className="meta-item">
                      📂 {bloque.proceso || 'Sin proceso'}
                    </span>
                    <span className="meta-item">
                      🏷️ {bloque.causal || 'Sin categoría'}
                    </span>
                    <span className="meta-item">
                      🔧 {bloque.campos?.length || 0} campos
                    </span>
                  </div>
                  
                  <div className="block-preview">
                    <div 
                      className="preview-text"
                      dangerouslySetInnerHTML={{ 
                        __html: bloque.texto?.replace(/<[^>]*>/g, ' ').substring(0, 120) + '...' 
                      }}
                    />
                    
                    {/* Vista previa completa al hacer hover */}
                    <div className="preview-modal">
                      <div className="preview-modal-content">
                        <strong>Vista Previa:</strong>
                        <div 
                          className="preview-html"
                          dangerouslySetInnerHTML={{ __html: bloque.texto }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="block-card-actions">
                  <button
                    className="btn-action btn-edit"
                    onClick={() => navigate(`/config/bloques/${bloque.id}`)}
                    title="Editar bloque"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Editar
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => eliminarBloque(bloque.id)}
                    title="Eliminar bloque"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
