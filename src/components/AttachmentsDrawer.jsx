import React, { useState } from "react";
import "./AttachmentsDrawer.css";

export default function AttachmentsDrawer({ open, onClose, attachments }) {
  if (!open) return null;
  return (
    <div className="attachments-drawer-overlay" onClick={onClose}>
      <div className="attachments-drawer" onClick={e => e.stopPropagation()}>
        <h2>Archivos adjuntos</h2>
        {attachments.length === 0 ? (
          <p>No hay archivos adjuntos para esta solicitud.</p>
        ) : (
          <ul>
            {attachments.map(att => (
              <li key={att.id}>
                <span>{att.file_name}</span>
                <span style={{marginLeft:8, fontSize:12, color:'#888'}}>{att.mime_type}</span>
                <span style={{marginLeft:8, fontSize:12}}>{(att.file_size/1024).toFixed(1)} KB</span>
                <a href={`/uploads/${att.file_name}`} target="_blank" rel="noopener noreferrer" style={{marginLeft:16}}>Descargar</a>
              </li>
            ))}
          </ul>
        )}
        <button className="close-btn" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
