import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  TextInput,
  Badge,
  Modal,
  Loader,
  Select,
  Group,
  Text,
  Stack,
  SimpleGrid,
  ScrollArea,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Eye, Edit2, Trash2, ArrowLeft, Plus, Search, CheckCircle, Info } from "lucide-react";
import { apiUrl } from "../../config/api";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function BlockConfig() {
  const navigate = useNavigate();
  const [bloques, setBloques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProcess, setFilterProcess] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [previewOpened, { open: openPreview, close: closePreview }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState(null);
  const [previewBlock, setPreviewBlock] = useState(null);

  useEffect(() => {
    cargarBloques();
  }, []);

  const cargarBloques = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/blocks'));
      if (!res.ok) throw new Error("Error al cargar bloques");
      const data = await res.json();
      setBloques(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminacion = (id) => {
    setDeleteId(id);
    open();
  };

  const eliminarBloque = async () => {
    try {
      const res = await fetch(apiUrl(`/api/blocks/${deleteId}`), { method: 'DELETE' });
      if (!res.ok) throw new Error("Error al eliminar bloque");
      cargarBloques();
      close();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const mostrarPreview = (bloque) => {
    setPreviewBlock(bloque);
    openPreview();
  };

  const bloquesFiltrados = bloques.filter(b => {
    const matchSearch = b.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchProcess = !filterProcess || b.process_id === parseInt(filterProcess);
    return matchSearch && matchProcess;
  });

  // Obtener procesos únicos correctamente
  const procesosMap = new Map();
  bloques.forEach(b => {
    if (b.process_id && b.process_name && !procesosMap.has(b.process_id)) {
      procesosMap.set(b.process_id, b.process_name);
    }
  });
  const procesos = Array.from(procesosMap, ([id, name]) => ({ id, name }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: "Configuración", path: "/configuracion" },
            { label: "Bloques" }
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Gestión de Bloques
            </h1>
            <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <CheckCircle size={18} className="text-teal-500" />
              {bloques.length} bloques configurados
            </p>
          </div>
          <button
            onClick={() => navigate("/configuracion/bloques/nuevo")}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/30"
          >
            <Plus size={20} />
            Nuevo Bloque
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6">
          <Group grow>
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar bloques..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <Select
              placeholder="Filtrar por proceso"
              value={filterProcess}
              onChange={setFilterProcess}
              data={[
                { value: "", label: "Todos los procesos" },
                ...procesos.map(p => ({ value: p.id.toString(), label: p.name }))
              ]}
              clearable
              size="md"
            />
          </Group>
        </div>

        {/* Tarjetas */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-8">
            <Text c="red" ta="center">{error}</Text>
          </div>
        ) : bloquesFiltrados.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-8">
            <Text ta="center" c="dimmed">No se encontraron bloques</Text>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bloquesFiltrados.map((bloque) => (
              <div
                key={bloque.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-2 flex-1 pr-2">
                    {bloque.name}
                  </h3>
                  <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-sm font-medium whitespace-nowrap">
                    <CheckCircle size={16} />
                    Activo
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Proceso:</span>
                    <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-md">
                      {bloque.process_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Prioridad:</span>
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-md">
                      Primera (#{bloque.order})
                    </span>
                  </div>
                </div>

                {/* Botón Ver Contenido */}
                <button
                  onClick={() => mostrarPreview(bloque)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-indigo-600 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-sm rounded-lg font-semibold transition-colors mb-4 shadow-sm"
                >
                  <Eye size={17} />
                  Ver Contenido
                </button>

                {/* Acciones */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-gray-700">
                  <button
                    onClick={() => navigate(`/configuracion/bloques/${bloque.id}`)}
                    className="w-24 px-3 py-2 border border-slate-400 dark:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 font-medium"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                    <span className="text-sm">Editar</span>
                  </button>
                  <button
                    onClick={() => confirmarEliminacion(bloque.id)}
                    className="w-24 px-3 py-2 border border-red-500 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 rounded-lg transition-colors flex items-center justify-center gap-1.5 font-medium"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                    <span className="text-sm">Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Confirmación */}
      <Modal opened={opened} onClose={close} title="Confirmar Eliminación" centered>
        <Stack>
          <Text>¿Estás seguro de que deseas eliminar este bloque?</Text>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <Text size="sm" c="red">
              Esta acción no se puede deshacer.
            </Text>
          </div>
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>
              Cancelar
            </Button>
            <Button color="red" onClick={eliminarBloque}>
              Eliminar
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal de Preview */}
      <Modal
        opened={previewOpened}
        onClose={closePreview}
        title={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Eye size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contenido del Bloque</h3>
              {previewBlock && (
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle size={14} className="text-teal-500" />
                  <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">Activo</span>
                </div>
              )}
            </div>
          </div>
        }
        size="xl"
        centered
      >
        {previewBlock && (
          <div className="space-y-6">
            {/* Info básica */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5">Nombre del Bloque</p>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">{previewBlock.name}</h4>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5">Orden</p>
                  <span className="inline-flex items-center px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-sm font-semibold rounded-lg">
                    #{previewBlock.order}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5">Proceso</p>
                  <span className="inline-flex px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-lg">
                    {previewBlock.process_name}
                  </span>
                </div>
                {previewBlock.category_name && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5">Categoría</p>
                    <span className="inline-flex px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-lg">
                      {previewBlock.category_name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Contenido del Bloque</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            </div>

            {/* Contenido HTML */}
            <div className="max-h-80 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl">
              <div className="p-5 bg-white dark:bg-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={16} className="text-slate-400" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Texto Configurado:</p>
                </div>
                {previewBlock.template_html ? (
                  <div 
                    className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
                    dangerouslySetInnerHTML={{ __html: previewBlock.template_html }}
                  />
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 italic">No hay contenido configurado</p>
                )}
              </div>
            </div>

            {/* Campos dinámicos */}
            {previewBlock.campos && previewBlock.campos.length > 0 && (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Campos Dinámicos</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
                    Este bloque contiene {previewBlock.campos.length} campo(s) dinámico(s):
                  </p>
                  <div className="space-y-2">
                    {previewBlock.campos.map((campo, idx) => (
                      <div key={idx} className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-md">
                          <CheckCircle size={14} />
                          {campo.label}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">({campo.type})</span>
                        {campo.required && (
                          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium rounded">
                            Requerido
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Acciones */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={closePreview}
                className="px-5 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  closePreview();
                  navigate(`/configuracion/bloques/${previewBlock.id}`);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                <Edit2 size={18} />
                Editar Bloque
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
