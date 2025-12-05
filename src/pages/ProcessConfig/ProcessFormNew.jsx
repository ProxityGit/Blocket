import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Input,
  Switch,
  Spinner,
} from "@heroui/react";

export default function ProcessFormNew() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = !!id;

  const [formData, setFormData] = useState({
    name: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (esEdicion) {
      cargarProceso();
    }
  }, [id]);

  const cargarProceso = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/processes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || "",
          is_active: data.is_active ?? true,
        });
      } else {
        alert("Error al cargar el proceso");
        navigate("/configuracion/procesos");
      }
    } catch (error) {
      console.error("Error al cargar proceso:", error);
      alert("Error al cargar proceso");
      navigate("/configuracion/procesos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("El nombre del proceso es requerido");
      return;
    }

    setGuardando(true);

    try {
      const url = esEdicion
        ? `http://localhost:3000/api/processes/${id}`
        : "http://localhost:3000/api/processes";

      const response = await fetch(url, {
        method: esEdicion ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(esEdicion ? "Proceso actualizado correctamente" : "Proceso creado correctamente");
        navigate("/configuracion/procesos");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "No se pudo guardar el proceso"}`);
      }
    } catch (error) {
      console.error("Error al guardar proceso:", error);
      alert("Error al guardar proceso");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="p-8">
          <CardBody className="flex flex-col items-center gap-4">
            <Spinner size="lg" color="primary" />
            <p className="text-gray-600 dark:text-gray-400">Cargando proceso...</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Button
            variant="light"
            size="sm"
            startContent={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }
            onPress={() => navigate("/configuracion/procesos")}
          >
            Volver a Procesos
          </Button>
          <h1 className="text-3xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {esEdicion ? "Editar Proceso" : "Nuevo Proceso"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {esEdicion
              ? "Modifica la información del proceso existente"
              : "Completa los datos para crear un nuevo proceso"}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <Card className="border-none shadow-lg">
            <CardBody className="gap-6 p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Información del Proceso
                  </h3>

                  <div className="space-y-4">
                    <Input
                      label="Nombre del Proceso"
                      labelPlacement="outside"
                      placeholder="Ej: Cobranza, Jurídico, Comercial"
                      value={formData.name}
                      onValueChange={(value) => setFormData({ ...formData, name: value })}
                      isRequired
                      variant="bordered"
                      size="lg"
                      maxLength={100}
                      description="Nombre descriptivo del proceso de la compañía"
                      classNames={{
                        label: "font-semibold text-gray-700 dark:text-gray-300 text-sm pb-1",
                        input: "text-base",
                        inputWrapper: "border-2 hover:border-primary-400 focus-within:!border-primary-500 h-12",
                        description: "text-xs mt-1",
                      }}
                      startContent={
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      }
                    />

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-5 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                      <Switch
                        isSelected={formData.is_active}
                        onValueChange={(value) => setFormData({ ...formData, is_active: value })}
                        size="lg"
                        classNames={{
                          wrapper: "group-data-[selected=true]:bg-gradient-to-r from-blue-600 to-purple-600",
                        }}
                      >
                        <div className="flex flex-col gap-1 ml-2">
                          <span className="font-semibold text-gray-900 dark:text-white text-base">Proceso Activo</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Los procesos inactivos no aparecerán en las opciones de selección
                          </span>
                        </div>
                      </Switch>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  variant="flat"
                  size="lg"
                  onPress={() => navigate("/configuracion/procesos")}
                  isDisabled={guardando}
                  className="font-semibold"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  isLoading={guardando}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg min-w-[180px]"
                  startContent={
                    !guardando && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )
                  }
                >
                  {guardando
                    ? "Guardando..."
                    : esEdicion
                    ? "Actualizar Proceso"
                    : "Crear Proceso"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </form>
      </div>
    </div>
  );
}
