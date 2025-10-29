import React from "react";

function PdfButton({ onClick, disabled }) {
  return (
    <button
      className="btn-primary"
      onClick={onClick}
      disabled={disabled}
      title={
        disabled
          ? "Completa todos los campos para exportar"
          : "Exportar PDF"
      }
    >
      Exportar PDF
    </button>
  );
}

export default PdfButton;
