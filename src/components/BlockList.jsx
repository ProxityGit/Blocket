import React, { useMemo, useState, useCallback, useEffect } from "react";
import "./BlockList.css";

const Chevron = ({ open }) => (
  <svg className={`chev ${open ? "open" : ""}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const BlockItem = React.memo(({ bloque, yaEnDocumento, onAgregar }) => {
  const [open, setOpen] = useState(false);
  const disabled = yaEnDocumento(bloque.id);

  return (
    <article className={`block-item ${open ? "expanded" : ""} ${disabled ? "disabled" : ""}`}>
      <header className="block-head" onClick={() => setOpen(v => !v)} role="button" aria-expanded={open}>
        <Chevron open={open} />
        <div className="block-main">
          <h4 className="block-title">{bloque.titulo}</h4>
          {bloque.proceso && <span className="block-proceso">{bloque.proceso}</span>}
        </div>
        <div className="block-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className="btn btn-icon" 
            disabled={disabled}
            onClick={() => !disabled && onAgregar(bloque)}
            title={disabled ? "Ya agregado" : "Agregar bloque"}
          >
            {disabled ? <CheckIcon /> : <PlusIcon />}
          </button>
        </div>
      </header>

      {open && (
        <div className="block-panel" role="region">
          <div className="panel-grid">
            <div className="panel-item">
              <span className="label">ID</span>
              <span className="value">{bloque.id || "—"}</span>
            </div>
            <div className="panel-item">
              <span className="label">Causal</span>
              <span className="value">{bloque.causal || "—"}</span>
            </div>
            <div className="panel-item">
              <span className="label">Tipo</span>
              <span className="value">{bloque.tipo || "—"}</span>
            </div>
            {bloque.descripcion && (
              <div className="panel-item">
                <span className="label">Descripción</span>
                <span className="value">{bloque.descripcion}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
});

export default function BlockList({ bloques, documento, onAgregar }) {
  // --- Estado UI ---
  const [q, setQ] = useState("");
  const [qDeb, setQDeb] = useState("");
  const [orden, setOrden] = useState("Relevancia"); // Relevancia | Proceso | Título
  const [filtrosOpen, setFiltrosOpen] = useState(false);

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

  return (
    <aside className="blocklist-container">
      {/* Topbar: búsqueda + ordenar */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-ico" aria-hidden>🔎</span>
          <input
            className="search-input"
            placeholder="Buscar por nombre, proceso, causal o tipo…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar"
          />
        </div>

        <div className="sort-wrap">
          <label className="sort-label">Ordenar por</label>
          <select className="sort-select" value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option>Relevancia</option>
            <option>Proceso</option>
            <option>Título</option>
          </select>
        </div>
      </div>

   

      {/* Filtros */}
      <section className="filters-wrap">
        <button className="filters-toggle" aria-expanded={filtrosOpen} onClick={() => setFiltrosOpen(v => !v)}>
          <Chevron open={filtrosOpen} /><span>Filtros</span>{(hayFiltros) && <span className="dot" />}
        </button>

        {filtrosOpen && (
          <div className="filters-panel open">
            <div className="filters-grid">
              <label className="filter-field">
                <span className="filter-label">Proceso</span>
                <select className="filter-select" value={filtroProceso} onChange={e => setFiltroProceso(e.target.value)}>
                  {procesos.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
              <label className="filter-field">
                <span className="filter-label">Causal</span>
                <select className="filter-select" value={filtroCausal} onChange={e => setFiltroCausal(e.target.value)}>
                  {causales.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="filter-field">
                <span className="filter-label">Tipo</span>
                <select className="filter-select" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
                  {tipos.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
            </div>

            <div className="filters-actions">
              <div className="active-chips">
                {filtroProceso !== "Todos" && <span className="chip chip-soft">Proceso: {filtroProceso}</span>}
                {filtroCausal !== "Todos" && <span className="chip chip-soft">Causal: {filtroCausal}</span>}
                {filtroTipo !== "Todos" && <span className="chip chip-soft">Tipo: {filtroTipo}</span>}
                {!hayFiltros && <span className="muted">Sin filtros activos</span>}
              </div>
              <button className="btn btn-ghost" onClick={resetFiltros}>Reiniciar filtros</button>
            </div>
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
          <BlockItem key={b.id} bloque={b} yaEnDocumento={yaEnDocumento} onAgregar={onAgregar} />
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
    </aside>
  );
}