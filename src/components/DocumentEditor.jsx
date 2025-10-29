import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./DocumentEditor.css";


import { useState } from "react";

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
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="documento-panel">
      <div className="documento" ref={docRef}>
        {tenantHeader && <div className="document-header">{tenantHeader}</div>}
        {alerta && <div className="alert">{alerta}</div>}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="doc-bloques">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={snapshot.isDraggingOver ? "drop-area" : ""}
              >
                {documento.length === 0 && (
                  <p className="texto-placeholder">
                    Selecciona bloques para empezar...
                  </p>
                )}
                {documento.map((b, i) => {
                  const completo = isGroupComplete(b.campos, camposValores);
                  return (
                    <Draggable key={b.id} draggableId={String(b.id)} index={i}>
                      {(provided, snapshot) => {
                        const isOpen = openIdx === i;
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bloque-editable bloque-acordeon ${snapshot.isDragging ? "dragging" : ""} ${isOpen ? "open" : ""}`}
                          >
                            <div className="bloque-header-acordeon" onClick={() => setOpenIdx(isOpen ? null : i)}>
                              <span className="drag-handle" {...provided.dragHandleProps} title="Arrastrar para mover">☰</span>
                              <span className="bloque-titulo">{b.titulo}</span>
                              <span className={`status-tag ${completo ? "completo" : "pendiente"}`}
                                title={completo ? "Todos los campos diligenciados" : "Faltan campos por completar"}
                              >
                                {completo ? "✔ Completado" : "⏳ Pendiente"}
                              </span>
                              <span className="acordeon-toggle">{isOpen ? "▲" : "▼"}</span>
                            </div>
                            {isOpen && (
                              <div className="bloque-body-acordeon">
                                <div className="bloque-toolbar">
                                  <button
                                    className="remove-btn"
                                    onClick={() => onQuitarBloque(i)}
                                    title="Quitar este bloque"
                                  >
                                    Quitar
                                  </button>
                                  <div className="conector-container">
                                    <button
                                      className="btn-conector"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const dropdown = e.currentTarget.nextSibling;
                                        const allDropdowns = document.querySelectorAll(
                                          ".conector-dropdown"
                                        );
                                        allDropdowns.forEach((d) =>
                                          d.classList.remove("show")
                                        );
                                        dropdown.classList.toggle("show");
                                      }}
                                    >
                                      {conectoresPorBloque[b.id] && conectoresPorBloque[b.id] !== ""
                                        ? `🔗 ${conectoresPorBloque[b.id]}`
                                        : "➕ Agregar conector"}
                                    </button>
                                    <div className="conector-dropdown">
                                      {opcionesConector.map((opt, idx) => (
                                        <div
                                          key={idx}
                                          className="conector-option"
                                          onClick={(e) => {
                                            actualizarConector(b.id, opt);
                                            e.currentTarget.parentElement.classList.remove(
                                              "show"
                                            );
                                          }}
                                        >
                                          {opt || "— Sin conector —"}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="bloque-contenido">
                                  <p className="parrafo-texto bloque-justificado">
                                    {renderParrafoConConector(b)}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default DocumentEditor;
