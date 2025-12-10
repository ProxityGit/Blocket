import React from "react";

function ConnectorSelect({ value, opciones, onChange }) {
  return (
    <div className="selector-conector">
      <label>Conector:</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {opciones.map((c, idx) => (
          <option key={idx} value={c}>
            {c || "— Sin conector —"}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ConnectorSelect;
