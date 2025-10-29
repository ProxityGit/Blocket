import React from "react";
import "./BlockList.css";

export default function BlockList({
  bloques,
  documento,
  onAgregar,
}) {
  const yaEnDocumento = (id) => documento.some((d) => d.id === id);

  return (
    <aside className="blocklist-container">
      <div className="blocklist-header">
        <h3>🧱 Bloques disponibles</h3>
      </div>

      <div className="blocklist-content">
        {bloques.map((b) => {
          const disabled = yaEnDocumento(b.id);
          return (
            <div
              key={b.id}
              className={`block-item ${disabled ? "disabled" : ""}`}
              onClick={() => {
                if (!disabled) onAgregar(b);
              }}
              title={
                disabled
                  ? "Este bloque ya está agregado al documento"
                  : "Agregar al documento"
              }
            >
              <div className="block-info">
                <span className="block-title">{b.titulo}</span>
                <span className="block-id">#{b.id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
