import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./DocumentEditor.css";

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
  tenantHeader, // 👈 Nuevo prop para el encabezado
}) {
  return (
    <div className="documento-panel">
      <div className="documento" ref={docRef}>
        {/* 🔹 Encabezado del documento (empresa / tenant) */}
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

                {documento.map((b, i) => (
                  <Draggable key={b.id} draggableId={String(b.id)} index={i}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bloque-editable ${
                          snapshot.isDragging ? "dragging" : ""
                        }`}
                      >
                        <div className="bloque-header">
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
                              {conectoresPorBloque[b.id] &&
                              conectoresPorBloque[b.id] !== ""
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
                        <p className="parrafo-texto">
                          {renderParrafoConConector(b)}
                        </p>
                      </div>


                    )}
                  </Draggable>
                ))}

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
