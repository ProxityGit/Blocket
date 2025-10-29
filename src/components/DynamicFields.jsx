//dynamicfields: DynamicFields.jsx
//descripción: Componente que muestra y gestiona los campos dinámicos de los bloques en el documento.

import { useState } from "react";
import "./DynamicFields.css";

function DynamicFields({ documento, camposValores, actualizarCampo }) {
  const [openGroup, setOpenGroup] = useState(null);

  const toggleGroup = (index) => {
    setOpenGroup(openGroup === index ? null : index);
  };

  // Función para validar si todos los campos del bloque están completos
  const isGroupComplete = (campos) => {
    if (!campos || campos.length === 0) return false;
    return campos.every((c) => {
      const valor = camposValores[c.name];
      return valor !== undefined && valor !== null && valor.toString().trim() !== "";
    });
  };

  return (
    <div className="panel-dinamicos">
      <h3>Campos dinámicos</h3>

      {documento.length === 0 && (
        <p className="texto-placeholder">Agrega bloques para editar sus campos.</p>
      )}

      {documento.map((b, index) => {
        const completo = isGroupComplete(b.campos);
        return (
          <div key={b.id} className="grupo-campos">
            <div className="grupo-header" onClick={() => toggleGroup(index)}>
              <div className="header-left">
                <h4>{b.titulo}</h4>
                <span
                  className={`status-tag ${completo ? "completo" : "pendiente"}`}
                  title={completo ? "Todos los campos diligenciados" : "Faltan campos por completar"}
                >
                  {completo ? "✔ Completo" : "⏳ Pendiente"}
                </span>
              </div>
              <span className={`icon-toggle ${openGroup === index ? "open" : ""}`}>▼</span>
            </div>

            <div className={`grupo-content ${openGroup === index ? "open" : ""}`}>
              {b.campos.map((c) => (
                <div key={c.name} className="field">
                  <label>{c.label}</label>
                  <input
                    type={c.type || "text"}
                    value={camposValores[c.name] || ""}
                    onChange={(e) => actualizarCampo(c.name, e.target.value)}
                    placeholder={`Escribe ${c.label.toLowerCase()}...`}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DynamicFields;
