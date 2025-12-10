import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./ConfigLayout.css";

export default function ConfigLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const configModules = [
    { 
      id: 'usuarios', 
      title: 'Usuarios', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ), 
      route: '/configuracion/usuarios' 
    },
    { 
      id: 'bloques', 
      title: 'Bloques de Texto', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ), 
      route: '/configuracion/bloques' 
    },
    { 
      id: 'procesos', 
      title: 'Procesos', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m4.22-13.78l-4.24 4.24m0 6l4.24 4.24M23 12h-6m-6 0H1m13.78-4.22l-4.24 4.24m0 0l-4.24 4.24"></path>
        </svg>
      ), 
      route: '/configuracion/procesos' 
    },
    { 
      id: 'categorias', 
      title: 'Categorías', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
      ), 
      route: '/configuracion/categorias' 
    },
    { 
      id: 'bandejas', 
      title: 'Bandejas', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
        </svg>
      ), 
      route: '/configuracion/bandejas' 
    },
    { 
      id: 'tipos-solicitud', 
      title: 'Tipos de Solicitud', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
      ), 
      route: '/configuracion/tipos-solicitud' 
    }
  ];

  const isActiveRoute = (route) => {
    return location.pathname.startsWith(route);
  };

  return (
    <div className="config-layout">
      <aside className="config-sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m4.22-13.78l-4.24 4.24m0 6l4.24 4.24M23 12h-6m-6 0H1m13.78-4.22l-4.24 4.24m0 0l-4.24 4.24"></path>
            </svg>
          </div>
          <h2>Configuración</h2>
          <p>Sistema de gestión</p>
        </div>

        <nav className="sidebar-nav">
          {configModules.map(module => (
            <button
              key={module.id}
              className={`sidebar-item ${isActiveRoute(module.route) ? 'active' : ''}`}
              onClick={() => navigate(module.route)}
            >
              <span className="sidebar-icon">{module.icon}</span>
              <span className="sidebar-title">{module.title}</span>
              {isActiveRoute(module.route) && <span className="active-indicator"></span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="config-content">
        <Outlet />
      </main>
    </div>
  );
}
