import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardBody, 
  CardFooter,
  Button,
  Chip,
  Divider
} from "@heroui/react";

export default function HomeModules() {
  const navigate = useNavigate();

  const modulosPrincipales = [
    {
      id: "crear-solicitud",
      nombre: "Crear Solicitud",
      descripcion: "Completa el formulario para crear una nueva solicitud.",
      color: "warning",
      icon: "📄",
      ruta: "/crear-solicitud",
    },
    {
      id: "registro",
      nombre: "Registro",
      descripcion: "Crea o importa solicitudes desde CRM o ERP.",
      color: "primary",
      icon: "📝",
      ruta: "/registro",
    },
    {
      id: "constructor",
      nombre: "Constructor",
      descripcion: "Genera documentos personalizados con bloques dinámicos.",
      color: "success",
      icon: "🧩",
      ruta: "/consulta",
    },
    {
      id: "asignacion",
      nombre: "Asignación",
      descripcion: "Asigna bloques o plantillas a las solicitudes.",
      color: "secondary",
      icon: "📦",
      ruta: "/asignacion",
    },
  ];

  const modulosApoyo = [
    { id: "configuracion", nombre: "Configuración", ruta: "/configuracion", icon: "⚙️" },
    { id: "consulta", nombre: "Consulta", ruta: "/consulta", icon: "🔍" },
    { id: "metricas", nombre: "Métricas", ruta: "/metricas", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block p-4 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
            <span className="text-6xl">🧭</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Blocket
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Automatiza la creación, asignación y construcción de documentos inteligentes
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg"
              color="default"
              variant="solid"
              className="bg-white text-primary-500 font-semibold"
              onPress={() => navigate("/consulta")}
            >
              🚀 Ir al Constructor
            </Button>
            <Button 
              size="lg"
              color="default"
              variant="bordered"
              className="border-white text-white font-semibold"
              onPress={() => navigate("/crear-solicitud")}
            >
              ➕ Nueva Solicitud
            </Button>
          </div>
        </div>
      </section>

      {/* Main Modules */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Módulos Principales
          </h2>
          <p className="text-gray-600">
            Herramientas core para la gestión de documentos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modulosPrincipales.map((modulo) => (
            <Card
              key={modulo.id}
              isPressable
              isHoverable
              onPress={() => navigate(modulo.ruta)}
              className="border-none bg-white shadow-md hover:shadow-xl transition-all"
            >
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{modulo.icon}</div>
                  <Chip
                    size="sm"
                    color={modulo.color}
                    variant="flat"
                  >
                    Activo
                  </Chip>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {modulo.nombre}
                </h3>
                <p className="text-sm text-gray-600">
                  {modulo.descripcion}
                </p>
              </CardBody>
              <Divider />
              <CardFooter className="justify-end p-4">
                <Button
                  size="sm"
                  color={modulo.color}
                  variant="flat"
                  endContent={<span>→</span>}
                >
                  Abrir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Support Modules */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Módulos de Soporte
          </h2>
          <p className="text-gray-600">
            Configuración y análisis del sistema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modulosApoyo.map((modulo) => (
            <Card
              key={modulo.id}
              isPressable
              isHoverable
              onPress={() => navigate(modulo.ruta)}
              className="bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
            >
              <CardBody className="p-6 flex-row items-center gap-4">
                <div className="text-3xl">{modulo.icon}</div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {modulo.nombre}
                  </h4>
                </div>
                <span className="text-gray-400">→</span>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 Blocket - Sistema de Gestión Documental
          </p>
        </div>
      </footer>
    </div>
  );
}
