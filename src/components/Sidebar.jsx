import "./Sidebar.css";

function Sidebar({ bloquesDisponibles, bloquesEnUso, agregarBloque }) {
  // Verifica si el bloque ya está agregado al constructor
  const bloqueUsado = (id) =>
    bloquesEnUso && bloquesEnUso.some((b) => b.id === id);

  return (
    <div className="sidebar">
      <h3>Bloques disponibles</h3>

      {bloquesDisponibles.map((b) => {
        const usado = bloqueUsado(b.id);

        return (
          <div
            key={b.id}
            className={`bloque-card ${usado ? "disabled" : ""}`}
            onClick={() => !usado && agregarBloque(b)}
          >
            <div className="bloque-header">
              <span className="bloque-titulo">{b.titulo}</span>
              <span
                className={`bloque-estado ${
                  usado ? "en-uso" : "disponible"
                }`}
              >
                {usado ? "🧩 En uso" : "➕ Agregar"}
              </span>
            </div>

            <div className="bloque-id">ID: {b.id}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;
