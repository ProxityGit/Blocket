import React, { useMemo, useState, useCallback, useEffect } from "react";
import "./BlockList.css";

const Chevron = ({ open }) => (
  <svg className={`chev ${open ? "open" : ""}`} width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
    <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 5L8 14l-4-4" />
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 10s2.5-5 8-5 8 5 8 5-2.5 5-8 5-8-5-8-5Z" />
    <circle cx="10" cy="10" r="2.5" />
  </svg>
);

const BlockItem = React.memo(({ bloque, yaEnDocumento, onAgregar, onVerContenido }) => {
  const disabled = yaEnDocumento(bloque.id);

  return (
    <article className={`block-item ${disabled ? "disabled" : ""}`}>
      <div className="block-content">
        <h4 className="block-title">{bloque.titulo}</h4>
        <div className="block-footer">
          {bloque.proceso && <span className="block-proceso">{bloque.proceso}</span>}
          <div className="block-actions">
            <button 
              className="btn btn-primary btn-icon" 
              disabled={disabled}
              onClick={() => !disabled && onAgregar(bloque)}
              title={disabled ? "Ya agregado" : "Seleccionar bloque"}
            >
              {disabled ? <CheckIcon /> : <PlusIcon />}
            </button>
            <button 
              className="btn btn-secondary btn-icon"
              onClick={() => onVerContenido(bloque)}
              title="Ver contenido del bloque"
            >
              <EyeIcon />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});

export default function BlockList({ bloques, documento, onAgregar }) {
  // --- Estado UI ---
  const [q, setQ] = useState("");
  const [qDeb, setQDeb] = useState("");
  const [orden, setOrden] = useState("Relevancia"); // Relevancia | Proceso | Título
  const [filtrosOpen, setFiltrosOpen] = useState(false);
  const [previewBlock, setPreviewBlock] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [filtroProceso, setFiltroProceso] = useState("Todos");
  const [filtroCausal, setFiltroCausal] = useState("Todos");
  const [filtroTipo, setFiltroTipo] = useState("Todos");

  // Debounce búsqueda
  useEffect(() => {
    const t = setTimeout(() => setQDeb(q.trim()), 220);
    return () => clearTimeout(t);
  }, [q]);

  const resetFiltros = useCallback(() => {
    setFiltroProceso("Todos"); setFiltroCausal("Todos"); setFiltroTipo("Todos");
  }, []);

  // --- Optimización: IDs en documento ---
  const yaEnDocumento = useMemo(() => {
    const ids = new Set(documento.map(d => d.id));
    return id => ids.has(id);
  }, [documento]);

  // --- Opciones únicas ---
  const { procesos, causales, tipos } = useMemo(() => {
    const uniq = k => ["Todos", ...new Set(bloques.map(b => b[k]).filter(Boolean))];
    return { procesos: uniq("proceso"), causales: uniq("causal"), tipos: uniq("tipo") };
  }, [bloques]);

  // --- Filtrado por texto + selects ---
  const normaliza = (s) => (s || "").toString().toLowerCase();
  const bloquesFiltrados = useMemo(() => {
    const term = normaliza(qDeb);
    return bloques.filter(b => {
      const matchTxt = !term
        || normaliza(b.titulo).includes(term)
        || normaliza(b.proceso).includes(term)
        || normaliza(b.causal).includes(term)
        || normaliza(b.tipo).includes(term);
      const matchProc = (filtroProceso === "Todos" || b.proceso === filtroProceso);
      const matchCaus = (filtroCausal === "Todos" || b.causal === filtroCausal);
      const matchTipo = (filtroTipo === "Todos" || b.tipo === filtroTipo);
      return matchTxt && matchProc && matchCaus && matchTipo;
    });
  }, [bloques, qDeb, filtroProceso, filtroCausal, filtroTipo]);

  // --- Orden ---
  const bloquesOrdenados = useMemo(() => {
    const arr = [...bloquesFiltrados];
    if (orden === "Título") {
      arr.sort((a, b) => normaliza(a.titulo).localeCompare(normaliza(b.titulo)));
    } else if (orden === "Proceso") {
      arr.sort((a, b) => normaliza(a.proceso).localeCompare(normaliza(b.proceso)) || normaliza(a.titulo).localeCompare(normaliza(b.titulo)));
    } else {
      // Relevancia simple: coincidencia al inicio > contiene > sin match
      const term = normaliza(qDeb);
      const score = (b) => {
        if (!term) return 0;
        const t = normaliza(b.titulo);
        if (t.startsWith(term)) return -2;
        if (t.includes(term)) return -1;
        return 0;
      };
      arr.sort((a, b) => score(a) - score(b));
    }
    return arr;
  }, [bloquesFiltrados, orden, qDeb]);

  const hayFiltros = filtroProceso !== "Todos" || filtroCausal !== "Todos" || filtroTipo !== "Todos";

  const mostrarPreview = (bloque) => {
    setPreviewBlock(bloque);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setPreviewBlock(null);
  };

  return (
    <aside className="blocklist-container">{/* Filtros colapsables con búsqueda y ordenar dentro */}
      <section className="filters-wrap">
        <button className="filters-toggle" aria-expanded={filtrosOpen} onClick={() => setFiltrosOpen(v => !v)}>
          <Chevron open={filtrosOpen} />
          <span>Filtros y Búsqueda</span>
          {(hayFiltros) && <span className="dot" />}
        </button>

        {filtrosOpen && (
          <div className="filters-content">
            {/* Búsqueda */}
            <div className="filter-group">
              <label className="filter-label">Buscar</label>
              <div className="search-wrap">
                <span className="search-ico" aria-hidden>🔎</span>
                <input
                  className="search-input"
                  placeholder="Nombre, proceso, causal..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  aria-label="Buscar"
                />
              </div>
            </div>

            {/* Ordenar */}
            <div className="filter-group">
              <label className="filter-label">Ordenar por</label>
              <select className="filter-select" value={orden} onChange={(e) => setOrden(e.target.value)}>
                <option>Relevancia</option>
                <option>Proceso</option>
                <option>Título</option>
              </select>
            </div>

            {/* Filtros específicos */}
            <div className="filter-group">
              <label className="filter-label">Proceso</label>
              <select className="filter-select" value={filtroProceso} onChange={e => setFiltroProceso(e.target.value)}>
                {procesos.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Causal</label>
              <select className="filter-select" value={filtroCausal} onChange={e => setFiltroCausal(e.target.value)}>
                {causales.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Tipo</label>
              <select className="filter-select" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
                {tipos.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Chips de filtros activos */}
            {hayFiltros && (
              <div className="active-filters">
                {filtroProceso !== "Todos" && <span className="filter-chip">Proceso: {filtroProceso}</span>}
                {filtroCausal !== "Todos" && <span className="filter-chip">Causal: {filtroCausal}</span>}
                {filtroTipo !== "Todos" && <span className="filter-chip">Tipo: {filtroTipo}</span>}
              </div>
            )}

            <button className="btn-reset" onClick={resetFiltros}>Reiniciar filtros</button>
          </div>
        )}
      </section>

       {/* Header con contador */}
      <div className="blocklist-header">
        <h3>Bloques disponibles</h3>
        <span className="count">{bloquesOrdenados.length}</span>
      </div>

      {/* Lista */}
      <div className="blocklist-content">
        {bloquesOrdenados.map(b => (
          <BlockItem 
            key={b.id} 
            bloque={b} 
            yaEnDocumento={yaEnDocumento} 
            onAgregar={onAgregar}
            onVerContenido={mostrarPreview}
          />
        ))}

        {bloquesOrdenados.length === 0 && (
          <div className="empty">
            <p>No se encontraron bloques.</p>
            <ul>
              <li>Amplía o limpia los filtros.</li>
              <li>Prueba con otra palabra clave.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Modal de Preview */}
      {modalOpen && previewBlock && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <div className="modal-icon">
                  <EyeIcon />
                </div>
                <div>
                  <h3>Contenido del Bloque</h3>
                  <span className="status-badge">Activo</span>
                </div>
              </div>
              <button className="modal-close" onClick={cerrarModal}>×</button>
            </div>

            <div className="modal-body">
              {/* Info básica */}
              <div className="info-card">
                <div className="info-header">
                  <div>
                    <p className="info-label">Nombre del Bloque</p>
                    <h4 className="info-title">{previewBlock.titulo}</h4>
                  </div>
                  <div className="info-order">
                    <p className="info-label">ID</p>
                    <span className="order-badge">#{previewBlock.id}</span>
                  </div>
                </div>
                
                <div className="info-tags">
                  {previewBlock.proceso && (
                    <div>
                      <p className="info-label">Proceso</p>
                      <span className="tag tag-blue">{previewBlock.proceso}</span>
                    </div>
                  )}
                  {previewBlock.causal && (
                    <div>
                      <p className="info-label">Causal</p>
                      <span className="tag tag-purple">{previewBlock.causal}</span>
                    </div>
                  )}
                  {previewBlock.tipo && (
                    <div>
                      <p className="info-label">Tipo</p>
                      <span className="tag tag-green">{previewBlock.tipo}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="divider">
                <span>Contenido del Bloque</span>
              </div>

              {/* Contenido HTML */}
              <div className="content-preview">
                {previewBlock.contenido ? (
                  <div 
                    className="content-html"
                    dangerouslySetInnerHTML={{ __html: previewBlock.contenido }}
                  />
                ) : (
                  <p className="content-empty">No hay contenido configurado</p>
                )}
              </div>

              {previewBlock.descripcion && (
                <>
                  <div className="divider">
                    <span>Descripción</span>
                  </div>
                  <div className="description-box">
                    <p>{previewBlock.descripcion}</p>
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={cerrarModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}