import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Input,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
} from "@heroui/react";

export default function ProcessConfigNew() {
  const navigate = useNavigate();
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    cargarProcesos();
  }, []);

  const cargarProcesos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/processes");
      const data = await response.json();
      setProcesses(data);
    } catch (error) {
      console.error("Error al cargar procesos:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminacion = (id) => {
    setDeleteId(id);
    onOpen();
  };

  const eliminarProceso = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/processes/${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        cargarProcesos();
        onClose();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "No se pudo eliminar el proceso"}`);
      }
    } catch (error) {
      console.error("Error al eliminar proceso:", error);
      alert("Error al eliminar proceso");
    }
  };

  const processesFiltrados = processes.filter((proceso) => {
    const matchSearch = proceso.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && proceso.is_active) ||
      (filterStatus === "inactive" && !proceso.is_active);
    return matchSearch && matchStatus;
  });

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "NOMBRE DEL PROCESO" },
    { key: "status", label: "ESTADO" },
    { key: "created_at", label: "FECHA CREACIÓN" },
    { key: "actions", label: "ACCIONES" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="light"
              size="sm"
              startContent={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              }
              onPress={() => navigate("/configuracion")}
            >
              Volver
            </Button>
            <h1 className="text-3xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gestión de Procesos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Administra los procesos de tu organización
            </p>
          </div>
          <Button
            color="primary"
            size="lg"
            startContent={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg"
            onPress={() => navigate("/configuracion/procesos/nuevo")}
          >
            Nuevo Proceso
          </Button>
        </div>

        {/* Filtros */}
        <Card className="border-none shadow-md">
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Buscar procesos..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                startContent={
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                classNames={{
                  input: "text-sm",
                  inputWrapper: "bg-gray-50 dark:bg-gray-900",
                }}
                className="flex-1"
              />
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "solid" : "flat"}
                  color={filterStatus === "all" ? "primary" : "default"}
                  onPress={() => setFilterStatus("all")}
                  size="md"
                >
                  Todos ({processes.length})
                </Button>
                <Button
                  variant={filterStatus === "active" ? "solid" : "flat"}
                  color={filterStatus === "active" ? "success" : "default"}
                  onPress={() => setFilterStatus("active")}
                  size="md"
                >
                  Activos ({processes.filter((p) => p.is_active).length})
                </Button>
                <Button
                  variant={filterStatus === "inactive" ? "solid" : "flat"}
                  color={filterStatus === "inactive" ? "warning" : "default"}
                  onPress={() => setFilterStatus("inactive")}
                  size="md"
                >
                  Inactivos ({processes.filter((p) => !p.is_active).length})
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tabla */}
        <Card className="border-none shadow-md">
          <CardBody className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="lg" color="primary" />
              </div>
            ) : processesFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No se encontraron procesos</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Intenta con otros criterios o crea uno nuevo</p>
                </div>
              </div>
            ) : (
              <Table aria-label="Tabla de procesos" removeWrapper>
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn key={column.key} className="bg-gray-50 dark:bg-gray-900">
                      {column.label}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={processesFiltrados}>
                  {(proceso) => (
                    <TableRow key={proceso.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <TableCell>
                        <Chip size="sm" variant="flat" color="default">
                          #{proceso.id}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 dark:text-white">{proceso.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={proceso.is_active ? "success" : "warning"}
                          variant="flat"
                          size="sm"
                          startContent={
                            <div className={`w-2 h-2 rounded-full ${proceso.is_active ? 'bg-green-500' : 'bg-orange-500'}`} />
                          }
                        >
                          {proceso.is_active ? "Activo" : "Inactivo"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {proceso.created_at ? new Date(proceso.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            startContent={
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            }
                            onPress={() => navigate(`/configuracion/procesos/${proceso.id}`)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            startContent={
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            }
                            onPress={() => confirmarEliminacion(proceso.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Modal de confirmación */}
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <span>Confirmar Eliminación</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-600 dark:text-gray-400">
              ¿Estás seguro de que deseas eliminar este proceso? Esta acción no se puede deshacer.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button color="danger" onPress={eliminarProceso} className="font-semibold">
              Eliminar Proceso
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
