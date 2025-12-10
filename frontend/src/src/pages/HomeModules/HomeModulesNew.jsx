import { useNavigate } from "react-router-dom";
import { FileText, ClipboardList, Package, FileCode, Settings, Search, BarChart3, Rocket, ChevronRight, Bell } from "lucide-react";

export default function HomeModules() {
  const navigate = useNavigate();

  // Add conveyor animation style
  const conveyorStyle = `
    @keyframes conveyor {
      0% { background-position: 0 0; }
      100% { background-position: 100px 0; }
    }
  `;

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
      ruta: "/crear-solicitud",
    },
    {
      id: "registro",
      nombre: "Registro de Solicitud",
      descripcion: "Crea o importa solicitudes desde CRM o ERP.",
      color: "from-blue-600 to-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      hoverColor: "hover:border-blue-400",
      Icon: ClipboardList,
      ruta: "/registro",
    },
    {
      id: "asignacion",
      nombre: "Asignación",
      descripcion: "Asigna bloques o plantillas a las solicitudes.",
      color: "from-cyan-600 to-sky-500",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      hoverColor: "hover:border-cyan-400",
      Icon: Package,
      ruta: "/asignacion",
    },
    {
      id: "constructor",
      nombre: "Constructor de Documentos",
      descripcion: "Genera documentos personalizados con bloques dinámicos.",
      color: "from-green-600 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      hoverColor: "hover:border-green-400",
      Icon: FileCode,
      ruta: "/consulta",
    },
    {
      id: "notificacion",
      nombre: "Notificación",
      descripcion: "Despacho automático de la solicitud al cliente.",
      color: "from-purple-600 to-violet-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      hoverColor: "hover:border-purple-400",
      Icon: Bell,
      ruta: "/notificacion",
    },
  ];

  const modulosApoyo = [
    { 
      id: "configuracion", 
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
    <>
      <style>{conveyorStyle}</style>
      <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white py-12">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <Rocket size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-3">Blocket</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Aumenta la eficiencia y experiencia del cliente a través de la automatización de construcción de documentos.
          </p>
        </div>
      </section>

      {/* Main Modules */}
      <section className="flex-1 mx-auto px-8 py-8 w-full overflow-y-auto">
        <div className="flex items-center gap-4 mb-8 max-w-[1600px] mx-auto">
          <h2 className="text-2xl font-bold text-gray-800">Procesos</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
        </div>
        
        {/* Conveyor Belt Container */}
        <div className="relative max-w-[1600px] mx-auto">
          {/* Conveyor Belt Line */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-3 bg-gray-200">
            <div className="absolute inset-0"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 15px, #9ca3af 15px, #9ca3af 25px)',
                animation: 'conveyor 15s linear infinite'
              }}>
            </div>
          </div>
          
          <div className="flex justify-center gap-6 relative z-10">
            {modulosPrincipales.map((m, index) => {
              const IconComponent = m.Icon;
              return (
                <div key={m.id} className="relative w-[280px]">
                  {/* Number Badge */}
                  <div className="flex justify-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300
                      flex items-center justify-center text-gray-600 text-sm font-semibold shadow-sm">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Card */}
                  <div
                    className="group relative bg-white rounded-2xl p-5 cursor-pointer
                      shadow-lg border border-gray-100 h-[280px] flex flex-col
                      transition-all duration-300 ease-out
                      hover:shadow-2xl hover:-translate-y-1"
                    onClick={() => navigate(m.ruta)}
                  >
                    {/* Icon */}
                    <div className="flex justify-start mb-3">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.color} 
                        flex items-center justify-center shadow-md
                        group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent size={28} className="text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <h3 className="text-base font-bold text-gray-900">
                        {m.nombre}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {m.descripcion}
                      </p>
                    </div>
                    
                    {/* Status Badge - Bottom Fixed */}
                    <div className="flex items-center gap-2 pt-3 pb-2.5">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-500 font-medium">
                        0 solicitudes
                      </span>
                    </div>
                    
                    {/* Bottom Accent Line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${m.color} rounded-b-2xl
                      transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}>
                    </div>
                    
                    {/* Play Button */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                        <ChevronRight size={16} className="text-white ml-0.5" strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Modules - Dock Style */}
      <div className="px-8 pb-5">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/50 px-4 py-3">
            <div className="flex items-center justify-center gap-2">
              {modulosApoyo.map((m) => {
                const IconComponent = m.Icon;
                return (
                  <button
                    key={m.id}
                    className="group flex flex-col items-center gap-1.5 p-2 rounded-2xl
                      hover:bg-gray-100/80 transition-all duration-300
                      transform hover:scale-110 hover:-translate-y-1"
                    onClick={() => navigate(m.ruta)}
                    title={m.nombre}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100
                      flex items-center justify-center shadow-md border border-gray-200/50
                      group-hover:shadow-xl group-hover:from-white group-hover:to-gray-50 transition-all duration-300">
                      <IconComponent size={28} className={`${m.color} group-hover:scale-110`} strokeWidth={2} />
                    </div>
                    <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                      {m.nombre}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-blue-600">Proxity SAS</span>
            <span className="mx-2">•</span>
            <span className="text-gray-700">Construimos el futuro digital a través de soluciones que revolucionan la experiencia del cliente</span>
          </p>
        </div>
      </footer>
      </div>
    </>
  );
}
