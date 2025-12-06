import { useNavigate } from "react-router-dom";
import { FileText, ClipboardList, Package, FileCode, Settings, Search, BarChart3, Rocket, ChevronRight } from "lucide-react";
import "./HomeModules.css";

export default function HomeModules() {
  const navigate = useNavigate();

  const modulosPrincipales = [
    {
      id: "crear-solicitud",
      nombre: "Crear Solicitud",
      descripcion: "Completa el formulario para crear una nueva solicitud.",
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      hoverColor: "hover:border-orange-400",
      Icon: FileText,
      esFormulario: true,
    },
    {
      id: "registro",
      nombre: "Registro de Solicitud",
      descripcion: "Crea o importa solicitudes desde CRM o ERP.",
      ruta: "/registro",
      color: "from-blue-600 to-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      hoverColor: "hover:border-blue-400",
      Icon: ClipboardList,
    },
    {
      id: "asignacion",
      nombre: "Asignación",
      descripcion: "Asigna bloques o plantillas a las solicitudes.",
      ruta: "/asignacion",
      color: "from-cyan-600 to-sky-500",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      hoverColor: "hover:border-cyan-400",
      Icon: Package,
    },
    {
      id: "constructor",
      nombre: "Constructor de Documentos",
      descripcion: "Selecciona una solicitud y genera su documento personalizado.",
      ruta: "/consulta",
      color: "from-green-600 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      hoverColor: "hover:border-green-400",
      Icon: FileCode,
    },
  ];

  const modulosApoyo = [
    {
      id: "configuracion-bloques",
      nombre: "Configuración",
      ruta: "/configuracion",
      Icon: Settings,
      color: "text-gray-600",
    },
    {
      id: "consulta",
      nombre: "Consulta",
      ruta: "/consulta",
      Icon: Search,
      color: "text-purple-600",
    },
    {
      id: "metricas",
      nombre: "Métricas",
      ruta: "/metricas",
      Icon: BarChart3,
      color: "text-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Rocket size={40} />
          </div>
          <h1 className="text-5xl font-bold mb-4">Blocket</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Automatiza la creación, asignación y construcción de documentos inteligentes.
          </p>
          <button
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
            onClick={() => navigate("/consulta")}
          >
            <Rocket size={20} />
            Ir al Constructor
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* ===== Procesos Clave ===== */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Procesos Clave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modulosPrincipales.map((m) => {
            const IconComponent = m.Icon;
            return (
              <div
                key={m.id}
                className={`group relative bg-white rounded-xl border-2 ${m.borderColor} ${m.hoverColor} 
                  transition-all duration-300 cursor-pointer overflow-hidden
                  hover:shadow-xl hover:-translate-y-1`}
                onClick={() => navigate(m.esFormulario ? "/crear-solicitud" : m.ruta)}
              >
                {/* Gradient top border */}
                <div className={`h-1.5 bg-gradient-to-r ${m.color}`}></div>
                
                <div className="p-6">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${m.bgColor} mb-4 
                    group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent size={28} className={`bg-gradient-to-r ${m.color} bg-clip-text text-transparent`} 
                      style={{ 
                        stroke: `url(#gradient-${m.id})`,
                        strokeWidth: 2
                      }} 
                    />
                    <svg width="0" height="0">
                      <defs>
                        <linearGradient id={`gradient-${m.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" className={m.color.split(' ')[0].replace('from-', 'stop-')} />
                          <stop offset="100%" className={m.color.split(' ')[2].replace('to-', 'stop-')} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {m.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {m.descripcion}
                  </p>
                  
                  {/* Arrow indicator */}
                  <div className="flex justify-end mt-4">
                    <ChevronRight 
                      size={20} 
                      className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" 
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== Dock de módulos de apoyo ===== */}
      <section className="max-w-7xl mx-auto px-8 pb-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Acceso Rápido</h3>
          <div className="flex flex-wrap gap-4">
            {modulosApoyo.map((m) => {
              const IconComponent = m.Icon;
              return (
                <button
                  key={m.id}
                  className="flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-lg border border-gray-200 
                    hover:border-gray-300 hover:bg-gray-100 hover:shadow-md transition-all duration-200 
                    group cursor-pointer"
                  onClick={() => navigate(m.ruta)}
                  title={m.nombre}
                >
                  <IconComponent size={20} className={m.color} />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {m.nombre}
                  </span>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

