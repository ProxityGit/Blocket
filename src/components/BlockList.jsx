// src/components/BlockList.jsx
import React from "react";

export default function BlockList({
  bloques,
  documento,
  onAgregar,
  onExport,
  exportDisabled,
}) {
  const yaEnDocumento = (id) => documento.some((d) => d.id === id);

  return (
    <aside className="blocklist">
      <div className="panel-title" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h3 style={{margin:0, fontSize:14, color:"#93c5fd", textTransform:"uppercase", letterSpacing:".4px"}}>
          🧱 Bloques disponibles
        </h3>
        
      </div>

      <div>
        {bloques.map((b) => {
          const disabled = yaEnDocumento(b.id);
          return (
            <div
              key={b.id}
              role="button"
              aria-disabled={disabled}
              onClick={() => { if (!disabled) onAgregar(b); }}
              title={disabled ? "Este bloque ya está en el documento" : "Agregar al documento"}
              style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"12px 14px", marginBottom:10, borderRadius:12,
                border:"1px solid rgba(148,163,184,0.2)",
                background: disabled ? "#0b1324" : "linear-gradient(180deg,#0f172a,#0b1220)",
                color:"#e5e7eb",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? .55 : 1,
                boxShadow:"0 10px 25px rgba(2,8,23,.35)"
              }}
            >
              <span style={{fontWeight:600}}>{b.titulo}</span>
              <span style={{fontSize:12, opacity:.8}}>#{b.id}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
