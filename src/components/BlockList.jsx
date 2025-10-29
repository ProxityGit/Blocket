//bloque: BlockList.jsx
//descripción: Componente que muestra la lista de bloques disponibles para agregar al documento, ahora con filtros y más información contextual.

import React, { useMemo, useState } from "react";
import "./BlockList.css";

// 📦 Componente memoizado para el elemento individual de la lista
const BlockItem = React.memo(({ bloque, yaEnDocumento, onAgregar }) => {
  // Nota: yaEnDocumento es una función memoizada que verifica si el ID está en el Set.
  const disabled = yaEnDocumento(bloque.id);

  return (
    <div
      key={bloque.id}
      className={`block-item ${disabled ? "disabled" : ""}`}
      onClick={() => {
        if (!disabled) onAgregar(bloque);
      }}
      title={
        disabled
          ? "Este bloque ya está agregado al documento"
          : "Agregar al documento"
      }
    >
      <div className="block-info">
        <span className="block-title">{bloque.titulo}</span>
        <span className="block-id">ID: {bloque.id}</span>
      </div>

      <div className="block-details">
        {/* Mostrando los nuevos campos de clasificación */}
        <span className="detail-item">
          <small>Proceso:</small> <strong>{bloque.proceso}</strong>
        </span>
        <span className="detail-item">
          <small>Causal:</small> <strong>{bloque.causal}</strong>
        </span>
        <span className="detail-item detail-type">
          <small>Tipo:</small> <strong>{bloque.tipo}</strong>
        </span>
      </div>
      
      {/* Indicador visual de estado */}
      <span className="block-icon">
        {disabled ? '✅' : '➕'} 
      </span>
    </div>
  );
});

export default function BlockList({
  bloques, // Ahora recibe los MOCK_BLOQUES
  documento,
  onAgregar,
}) {
  // Estado para manejar los filtros
  const [filtroProceso, setFiltroProceso] = useState('Todos');
  const [filtroCausal, setFiltroCausal] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  // Optimización: Crear un Set de IDs del documento para búsquedas rápidas (O(1))
  const yaEnDocumento = useMemo(() => {
    // Convierte el array de documentos a un Set de IDs
    const documentoIds = new Set(documento.map(d => d.id));
    return (id) => documentoIds.has(id);
  }, [documento]); 

  // Obtener valores únicos para los selectores de filtro
  const { procesos, causales, tipos } = useMemo(() => {
    // Función auxiliar para obtener valores únicos, siempre incluyendo 'Todos'
    const unique = (key) => ['Todos', ...new Set(bloques.map(b => b[key]))];
    return {
      procesos: unique('proceso'),
      causales: unique('causal'),
      tipos: unique('tipo'),
    };
  }, [bloques]);

  // Lógica de filtrado: se recalcula solo si los bloques o los filtros cambian
  const bloquesFiltrados = useMemo(() => {
    return bloques.filter(b => 
      (filtroProceso === 'Todos' || b.proceso === filtroProceso) &&
      (filtroCausal === 'Todos' || b.causal === filtroCausal) &&
      (filtroTipo === 'Todos' || b.tipo === filtroTipo)
    );
  }, [bloques, filtroProceso, filtroCausal, filtroTipo]);

  return (
    <aside className="blocklist-container">
      <div className="blocklist-header">
        <h3>🧱 Bloques disponibles ({bloquesFiltrados.length})</h3>
      </div>

      {/* --- Contenedor de Filtros --- */}
      <div className="blocklist-filters">
        <select 
          value={filtroProceso} 
          onChange={(e) => setFiltroProceso(e.target.value)}
          className="filter-select"
          aria-label="Filtro por Proceso"
        >
          {procesos.map(p => <option key={p} value={p}>Proceso: {p}</option>)}
        </select>
        
        <select 
          value={filtroCausal} 
          onChange={(e) => setFiltroCausal(e.target.value)}
          className="filter-select"
          aria-label="Filtro por Causal"
        >
          {causales.map(c => <option key={c} value={c}>Causal: {c}</option>)}
        </select>

        <select 
          value={filtroTipo} 
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="filter-select"
          aria-label="Filtro por Tipo"
        >
          {tipos.map(t => <option key={t} value={t}>Tipo: {t}</option>)}
        </select>
      </div>
      {/* ----------------------------- */}

      <div className="blocklist-content">
        {bloquesFiltrados.map((b) => (
          <BlockItem 
            key={b.id} 
            bloque={b} 
            yaEnDocumento={yaEnDocumento} 
            onAgregar={onAgregar} 
          />
        ))}
        {bloquesFiltrados.length === 0 && (
            <p className="no-results">No se encontraron bloques con los filtros seleccionados.</p>
        )}
      </div>
    </aside>
  );
}