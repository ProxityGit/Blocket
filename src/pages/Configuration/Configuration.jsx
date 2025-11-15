import { useNavigate } from "react-router-dom";
import "./Configuration.css";

export default function Configuration() {
  const navigate = useNavigate();

  const configModules = [
    {
      id: 'usuarios',
      title: 'Usuarios',
      description: 'Gestión de usuarios del sistema, permisos y roles',
      icon: '👥',
      route: '/configuracion/usuarios',
      color: '#667eea'
    },
    {
      id: 'bloques',
      title: 'Bloques de Texto',
      description: 'Configuración de bloques de contenido y campos dinámicos',
      icon: '📝',
      route: '/config/bloques',
      color: '#764ba2'
    },
    {
      id: 'procesos',
      title: 'Procesos',
      description: 'Definición de procesos de la compañía',
      icon: '⚙️',
      route: '/configuracion/procesos',
      color: '#f093fb'
    },
    {
      id: 'categorias',
      title: 'Categorías de Servicio',
      description: 'Gestión de categorías y claves de bloques',
      icon: '🏷️',
      route: '/configuracion/categorias',
      color: '#4facfe'
    },
    {
      id: 'bandejas',
      title: 'Bandejas',
      description: 'Agrupación de tipos de solicitudes por equipos de trabajo',
      icon: '📥',
      route: '/configuracion/bandejas',
      color: '#43e97b'
    },
    {
      id: 'tipos-solicitud',
      title: 'Tipos de Solicitud',
      description: 'Configuración de tipos: Quejas, Reclamos, Peticiones, Tutelas',
      icon: '📋',
      route: '/configuracion/tipos-solicitud',
      color: '#fa709a'
    }
  ];

  return (
    <div className="configuration-page">
      <header className="configuration-header">
        <h1>Centro de Configuración</h1>
        <p>Gestiona todos los parámetros y configuraciones del sistema</p>
      </header>

      <div className="config-modules-grid">
        {configModules.map((module) => (
          <div
            key={module.id}
            className="config-module-card"
            onClick={() => navigate(module.route)}
            style={{ '--module-color': module.color }}
          >
            <div className="module-icon">{module.icon}</div>
            <div className="module-info">
              <h3>{module.title}</h3>
              <p>{module.description}</p>
            </div>
            <div className="module-arrow">→</div>
          </div>
        ))}
      </div>

      <div className="config-info-panel">
        <div className="info-card">
          <h4>💡 Acerca de la configuración</h4>
          <ul>
            <li><strong>Usuarios:</strong> Administra quiénes tienen acceso al sistema y sus permisos</li>
            <li><strong>Bloques:</strong> Define plantillas de texto reutilizables con campos dinámicos</li>
            <li><strong>Procesos:</strong> Organiza los diferentes flujos de trabajo de la compañía</li>
            <li><strong>Categorías:</strong> Clasifica los bloques según el tipo de servicio</li>
            <li><strong>Bandejas:</strong> Agrupa tipos de solicitudes para asignarlas a equipos específicos</li>
            <li><strong>Tipos de Solicitud:</strong> Define las categorías principales (Quejas, Reclamos, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
