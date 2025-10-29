import React from "react";

function ToolsPanel({ onExportClick, exportDisabled, onAnalyzeAI, aiStatus }) {
  return (
    <div className="tools-panel">
      <h3>Acciones</h3>

      <button
        className="tool-button"
        onClick={onExportClick}
        disabled={exportDisabled}
      >
        📄 Exportar PDF
      </button>

      <button
        className="tool-button secondary"
        onClick={onAnalyzeAI}
      >
        🤖 Analizar con IA
      </button>

      <div className="ai-status">
        {aiStatus ? aiStatus : "Sin análisis en curso"}
      </div>
    </div>
  );
}

export default ToolsPanel;
