import { useNavigate } from "react-router-dom";
import { Card, SimpleGrid } from "@mantine/core";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  IconUser,
  IconFolder,
  IconInbox,
  IconClipboardList,
  IconBuildingStore,
  IconSettings,
  IconChevronRight,
  IconFileText,
} from "@tabler/icons-react";

export default function Configuration() {
  const navigate = useNavigate();

  const modules = [
    {
      id: 1,
      name: "Usuarios",
      description: "Gestión de usuarios del sistema",
      icon: IconUser,
      path: "/configuracion/usuarios",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      name: "Categorías",
      description: "Configuración de categorías",
      icon: IconFolder,
      path: "/configuracion/categorias",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      name: "Bandejas",
      description: "Gestión de bandejas",
      icon: IconInbox,
      path: "/configuracion/bandejas",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: 4,
      name: "Tipos de Solicitud",
      description: "Configuración de tipos",
      icon: IconClipboardList,
      path: "/configuracion/tipos-solicitud",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: 5,
      name: "Bloques",
      description: "Gestión de bloques",
      icon: IconBuildingStore,
      path: "/configuracion/bloques",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      id: 6,
      name: "Procesos",
      description: "Configuración de procesos",
      icon: IconSettings,
      path: "/configuracion/procesos",
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      id: 7,
      name: "Encabezado",
      description: "Configuración de encabezado de documentos",
      icon: IconFileText,
      path: "/configuracion/encabezado",
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs 
            items={[
              { label: "Configuración" }
            ]}
          />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Configuración
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona todos los aspectos del sistema desde un solo lugar
          </p>
        </div>

        {/* Modules Grid */}
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing="lg"
        >
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Card
                key={module.id}
                shadow="md"
                padding="xl"
                radius="lg"
                className="hover:shadow-xl transition-all duration-200 cursor-pointer border-0"
                onClick={() => navigate(module.path)}
              >
                <div className="flex flex-col h-full">
                  {/* Icon with gradient */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <IconComponent size={32} stroke={2} className="text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {module.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {module.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-medium">
                    <span className="text-sm">Configurar</span>
                    <IconChevronRight size={16} className="ml-2" />
                  </div>
                </div>
              </Card>
            );
          })}
        </SimpleGrid>
      </div>
    </div>
  );
}

