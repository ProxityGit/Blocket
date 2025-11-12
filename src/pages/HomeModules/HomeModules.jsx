import { useNavigate } from "react-router-dom";
import "./HomeModules.css";
// import SolicitudForm from "../../components/SolicitudForm";

export default function HomeModules() {
  const navigate = useNavigate();

  const modulosPrincipales = [
      {
        id: "crear-solicitud",
        nombre: "Crear Solicitud",
        descripcion: "Completa el formulario para crear una nueva solicitud.",
        color: "#f59e42",
        icono: "📄",
        esFormulario: true,
      },
    {
      id: "registro",
      nombre: "Registro de Solicitud",
      descripcion: "Crea o importa solicitudes desde CRM o ERP.",
      ruta: "/registro",
      color: "#2563eb",
      icono: "📝",
    },
    {
      id: "asignacion",
      nombre: "Asignación",
      descripcion: "Asigna bloques o plantillas a las solicitudes.",
      ruta: "/asignacion",
      color: "#0284c7",
      icono: "📦",
    },
    {
      id: "constructor",
      nombre: "Constructor de Documentos",
      descripcion: "Selecciona una solicitud y genera su documento personalizado.",
      ruta: "/consulta",
      color: "#16a34a",
      icono: "🧩",
    },
  ];

  const modulosApoyo = [
    {
      id: "parametrizacion",
      nombre: "Parametrización",
      ruta: "/parametrizacion",
      icono: "⚙️",
    },
    {
      id: "consulta",
      nombre: "Consulta",
      ruta: "/consulta",
      icono: "🔍",
    },
    {
      id: "metricas",
      nombre: "Métricas",
      ruta: "/metricas",
      icono: "📊",
    },
  ];

  return (
    <div className="home-container light-theme">
      {/* ===== Hero Section ===== */}
      <section className="hero-banner light">
        <div className="hero-content">
          <div className="hero-logo">🧭</div>
          <h1>Blocket</h1>
          <p className="hero-subtitle">
            Automatiza la creación, asignación y construcción de documentos inteligentes.
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate("/consulta")}
          >
            🚀 Ir al Constructor
          </button>
        </div>
      </section>

      {/* ===== Procesos Clave ===== */}
      <section className="section-main light">
        <h2>Procesos Clave</h2>
        <div className="tile-grid light">
            {modulosPrincipales.map((m) => (
                <div
                  key={m.id}
                  className="tile-card light"
                  style={{
                    borderTopColor: m.color,
                    boxShadow: `0 4px 20px ${m.color}20`,
                  }}
                  onClick={() => navigate(m.esFormulario ? "/crear-solicitud" : m.ruta)}
                >
                  <div className="tile-icon light" style={{ backgroundColor: `${m.color}15` }}>
                    {m.icono}
                  </div>
                  <div className="tile-info">
                    <h3>{m.nombre}</h3>
                    <p>{m.descripcion}</p>
                  </div>
                </div>
            ))}
        </div>
         
      </section>

      {/* ===== Dock de módulos de apoyo ===== */}
      <section className="section-dock">
        <div className="dock-container">
          {modulosApoyo.map((m) => (
            <div
              key={m.id}
              className="dock-item"
              onClick={() => navigate(m.ruta)}
              title={m.nombre}
            >
              <span className="dock-icon">{m.icono}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

