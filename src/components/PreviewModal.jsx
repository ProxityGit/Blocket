
import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./PreviewModal.css";
import { TENANT_CONFIG } from "../data/tenantConfig";

export default function PreviewModal({
  open = false,
  onClose,
  documento = [],
  renderParrafoConConector,
  camposValores = {},
  tenantHeader
}) {
  // ⛔️ Si no está abierto, NO se monta (no hay DOM que estorbe)
  if (!open) {
    // Limpia el contenido del modal-root si existe (por si quedó pegado)
    const mountNode = document.getElementById("modal-root");
    if (mountNode) mountNode.innerHTML = "";
    return null;
  }

  // Cerrar con ESC
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const handleClose = () => {
    // Limpia el contenido del modal-root al cerrar
    const mountNode = document.getElementById("modal-root");
    if (mountNode) mountNode.innerHTML = "";
    onClose?.();
  };

  const overlay = (
    <div
      className="preview-overlay"
  onClick={handleClose}                 // cerrar al click de overlay
      role="dialog"
      aria-modal="true"
      aria-label="Vista previa del documento"
    >
      <div
        className="preview-modal"
        onClick={(e) => e.stopPropagation()}      // evitar que burbujee al overlay
      >

        <header className="preview-header">
          <h2>📄 Vista previa del documento</h2>
          <button
            type="button"
            className="close-btn"
            onClick={handleClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>

        {/* Solo la banda azul es fija. El resto scrollea normalmente. */}

        <div className="document-preview-container">
          <div className="document-page">


            {/* Membrete de empresa (logo, nombre, dirección) */}
            <div className="membrete-empresa">
              <div className="membrete-content">
                {TENANT_CONFIG.logo && (
                  <img src={TENANT_CONFIG.logo} alt="Logo empresa" className="membrete-logo" />
                )}
                <div>
                  <h2 className="membrete-nombre">{TENANT_CONFIG.nombreEmpresa}</h2>
                  <p className="membrete-direccion">{TENANT_CONFIG.direccion}</p>
                </div>
              </div>
              <hr className="membrete-divider" />
            </div>

            {/* Resto del encabezado de la carta (fecha, destinatario, asunto, saludo) */}
            {tenantHeader && tenantHeader.props && tenantHeader.props.header && (
              <div className="document-tenant-header" style={{ marginBottom: 24 }}>
                <div className="letter-meta">
                  <p className="letter-date">{tenantHeader.props.header.fecha}</p>
                  <p><br /></p>
                  <p><strong>Señor(a):</strong> {tenantHeader.props.header.destinatario}</p>
                  <p><strong>Radicado:</strong> {tenantHeader.props.header.radicado}</p><p><br /></p>
                  <p><strong>Asunto:</strong> {tenantHeader.props.header.asunto}</p>
                </div>
                <div className="letter-saludo">
                  <p>{tenantHeader.props.header.saludo}</p>
                </div>
              </div>
            )}

            <div className="document-body">
              {documento.length === 0 ? (
                <p style={{ textAlign: "center", color: "#64748b" }}>
                  No hay bloques agregados al documento.
                </p>
              ) : (
                documento.map((bloque, idx) => (
                  <div key={idx} className="preview-block">
                    {renderParrafoConConector(bloque)}
                  </div>
                ))
              )}
            </div>

            <div className="document-footer">
              <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                Documento generado automáticamente por el sistema de gestión de correspondencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 🚪 Montamos fuera del árbol normal (evita solapes y residuos HMR)
  let mountNode = document.getElementById("modal-root");
  if (!mountNode) {
    mountNode = document.body;
  }
  return createPortal(overlay, mountNode);
}
