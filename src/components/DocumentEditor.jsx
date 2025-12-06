import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link2, X, GripVertical } from "lucide-react";
import "./DocumentEditor.css";
import { useState } from "react";
import React from "react";

function isGroupComplete(campos, camposValores) {
  if (!campos || campos.length === 0) return false;
  return campos.every((c) => {
    const valor = camposValores[c.name];
    return valor !== undefined && valor !== null && valor.toString().trim() !== "";
  });
}

function DocumentEditor({
  documento,
  onDragEnd,
  onQuitarBloque,
  conectoresPorBloque,
  actualizarConector,
  renderParrafoConConector,
  opcionesConector,
  alerta,
  docRef,
  tenantHeader,
  camposValores,
}) {
  const [openIdxs, setOpenIdxs] = useState([]);
  console.log("[DEBUG] opcionesConector:", opcionesConector);
  
  // Calcular número de páginas necesarias
  // Altura disponible por página: 931px (1123px - 192px de márgenes)
  const ALTURA_DISPONIBLE = 931;
  const ALTURA_HEADER = tenantHeader ? 120 : 0;
  const ALTURA_ALERTA = alerta ? 50 : 0;
  const ALTURA_ESTIMADA_BLOQUE = 150; // Altura promedio más realista por bloque
  
  // Primera página tiene menos espacio por el header y alertas
  const alturaPrimeraPagenaDisponible = ALTURA_DISPONIBLE - ALTURA_HEADER - ALTURA_ALERTA;
  const bloquesPrimeraPage = Math.max(1, Math.floor(alturaPrimeraPagenaDisponible / ALTURA_ESTIMADA_BLOQUE));
  const bloquesRestantes = Math.max(0, documento.length - bloquesPrimeraPage);
  const bloquesPorPaginaCompleta = Math.max(1, Math.floor(ALTURA_DISPONIBLE / ALTURA_ESTIMADA_BLOQUE));
  const paginasAdicionales = Math.ceil(bloquesRestantes / bloquesPorPaginaCompleta);
  const numberOfPages = Math.max(1, documento.length > 0 ? 1 + paginasAdicionales : 1);
  
  console.log('[PAGINACIÓN]', {
    bloquesPrimeraPage,
    bloquesPorPaginaCompleta,
    totalBloques: documento.length,
    numberOfPages
  });
  
  // Determinar en qué página está cada bloque
  const getPaginaDeBloque = (idx) => {
    if (idx < bloquesPrimeraPage) return 0;
    return 1 + Math.floor((idx - bloquesPrimeraPage) / bloquesPorPaginaCompleta);
  };
  
  return (
    <div className="documento-panel">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="doc-bloques">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="documento-page-continuo" ref={docRef}>
                {tenantHeader && <div className="document-header">{tenantHeader}</div>}
                {alerta && <div className="alert">{alerta}</div>}
                
                {documento.length === 0 && (
                  <p className="texto-placeholder">
                    Selecciona bloques para empezar...
                  </p>
                )}
                
                {documento.map((b, i) => {
                  const completo = isGroupComplete(b.campos, camposValores);
                  const ordenClass = `bloque-orden-${(i % 6) + 1}`;
                  
                  return (
                    <Draggable key={b.id} draggableId={String(b.id)} index={i}>
                      {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bloque-wrapper ${ordenClass} ${snapshot.isDragging ? "dragging" : ""}`}
                            >
                              {/* Panel izquierdo con nombre del bloque */}
                              <div className="bloque-panel-izquierdo">
                                <div className="bloque-nombre-completo" title={b.titulo}>
                                  {b.titulo}
                                </div>
                              </div>
                              
                              {/* Contenido limpio del bloque (solo texto) */}
                              <div className="bloque-contenido-limpio">
                                <div className="parrafo-texto bloque-justificado">
                                  {renderParrafoConConector(b)}
                                </div>
                              </div>
                              
                              {/* Panel derecho compacto solo con controles */}
                              <div className="bloque-panel-lateral">
                                <span className="drag-handle" {...provided.dragHandleProps} title="Arrastrar">
                                  <GripVertical size={16} />
                                </span>
                                
                                <span className={`status-badge ${completo ? "completo" : "pendiente"}`}
                                  title={completo ? "Completado" : "Pendiente"}
                                >
                                  {completo ? "✔" : "○"}
                                </span>
                                
                                <div className="conector-container">
                                  <button
                                    className="btn-conector-icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const dropdown = e.currentTarget.nextSibling;
                                      const allDropdowns = document.querySelectorAll(".conector-dropdown");
                                      allDropdowns.forEach((d) => d.classList.remove("show"));
                                      dropdown.classList.toggle("show");
                                    }}
                                    title="Conector"
                                  >
                                    <Link2 size={13} />
                                  </button>
                                  <div className="conector-dropdown">
                                    {opcionesConector && opcionesConector.length === 0 && (
                                      <div className="conector-option">No hay conectores</div>
                                    )}
                                    {opcionesConector && opcionesConector.map((opt, idx) => (
                                      <div
                                        key={idx}
                                        className="conector-option"
                                        onClick={(e) => {
                                          actualizarConector(b.id, opt);
                                          e.currentTarget.parentElement.classList.remove("show");
                                        }}
                                      >
                                        {opt || "— Sin conector —"}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <button
                                  className="btn-remove-icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onQuitarBloque(i);
                                  }}
                                  title="Quitar"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      );
    }

export default DocumentEditor;
