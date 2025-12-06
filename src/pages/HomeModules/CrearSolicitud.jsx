import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  TextInput,
  Textarea,
  Select,
  Group,
  Stack,
  Text,
  FileInput,
  Notification,
  Loader,
  Badge,
  CloseButton,
} from "@mantine/core";
import { 
  FileText, 
  User, 
  Mail, 
  MapPin, 
  Upload, 
  CheckCircle, 
  AlertCircle
} from "lucide-react";
import { apiUrl } from "../../config/api";
import Breadcrumbs from "../../components/Breadcrumbs";

// Departamentos y ciudades de Colombia
const DEPARTAMENTOS_COLOMBIA = {
  "Amazonas": ["Leticia", "Puerto Nariño"],
  "Antioquia": ["Medellín", "Bello", "Itagüí", "Envigado", "Apartadó", "Turbo", "Rionegro", "Caucasia"],
  "Arauca": ["Arauca", "Tame", "Arauquita", "Saravena"],
  "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Sabanalarga", "Puerto Colombia"],
  "Bogotá D.C.": ["Bogotá"],
  "Bolívar": ["Cartagena", "Magangué", "Turbaco", "Arjona", "El Carmen de Bolívar"],
  "Boyacá": ["Tunja", "Duitama", "Sogamoso", "Chiquinquirá", "Paipa"],
  "Caldas": ["Manizales", "Villamaría", "La Dorada", "Chinchiná", "Riosucio"],
  "Caquetá": ["Florencia", "San Vicente del Caguán", "Puerto Rico"],
  "Casanare": ["Yopal", "Aguazul", "Villanueva", "Monterrey", "Tauramena"],
  "Cauca": ["Popayán", "Santander de Quilichao", "Puerto Tejada", "Patía"],
  "Cesar": ["Valledupar", "Aguachica", "Bosconia", "Codazzi", "La Jagua de Ibirico"],
  "Chocó": ["Quibdó", "Istmina", "Condoto", "Tadó"],
  "Córdoba": ["Montería", "Cereté", "Lorica", "Sahagún", "Planeta Rica"],
  "Cundinamarca": ["Soacha", "Fusagasugá", "Chía", "Zipaquirá", "Facatativá", "Girardot", "Mosquera"],
  "Guainía": ["Inírida"],
  "Guaviare": ["San José del Guaviare"],
  "Huila": ["Neiva", "Pitalito", "Garzón", "La Plata", "Campoalegre"],
  "La Guajira": ["Riohacha", "Maicao", "Uribia", "Manaure", "Fonseca"],
  "Magdalena": ["Santa Marta", "Ciénaga", "Fundación", "Plato", "El Banco"],
  "Meta": ["Villavicencio", "Acacías", "Granada", "Puerto López", "San Martín"],
  "Nariño": ["Pasto", "Tumaco", "Ipiales", "Túquerres", "Samaniego"],
  "Norte de Santander": ["Cúcuta", "Ocaña", "Pamplona", "Villa del Rosario", "Los Patios"],
  "Putumayo": ["Mocoa", "Puerto Asís", "Orito", "Valle del Guamuez"],
  "Quindío": ["Armenia", "Calarcá", "La Tebaida", "Montenegro", "Circasia"],
  "Risaralda": ["Pereira", "Dosquebradas", "Santa Rosa de Cabal", "La Virginia"],
  "San Andrés y Providencia": ["San Andrés", "Providencia"],
  "Santander": ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta", "Barrancabermeja", "San Gil"],
  "Sucre": ["Sincelejo", "Corozal", "San Marcos", "Sampués", "Tolú"],
  "Tolima": ["Ibagué", "Espinal", "Melgar", "Honda", "Chaparral", "Líbano"],
  "Valle del Cauca": ["Cali", "Palmira", "Buenaventura", "Tuluá", "Cartago", "Buga", "Jamundí", "Yumbo"],
  "Vaupés": ["Mitú"],
  "Vichada": ["Puerto Carreño"]
};

const CrearSolicitud = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState([]);
  
  const [form, setForm] = useState({
    nombres: '',
    tipo_identificacion: '',
    identificacion: '',
    email: '',
    tipo_cliente: '',
    tipo_solicitud: '',
    pais: 'Colombia',
    departamento: '',
    ciudad: '',
    solicitud: '',
    adjunto: null,
    tenant_id: 1,
    channel_id: 1,
    status_id: 1
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setError(null);
    
    // Si cambia el departamento, actualizar ciudades disponibles y resetear ciudad
    if (field === 'departamento') {
      const ciudades = DEPARTAMENTOS_COLOMBIA[value] || [];
      setCiudadesDisponibles(ciudades);
      setForm({ ...form, departamento: value, ciudad: '' });
    }
  };

  const removeFile = () => {
    setForm({ ...form, adjunto: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validar campos obligatorios
    const requiredFields = [
      { key: 'nombres', label: 'Nombres y apellidos' },
      { key: 'tipo_identificacion', label: 'Tipo de identificación' },
      { key: 'identificacion', label: 'Identificación del cliente' },
      { key: 'email', label: 'Email' },
      { key: 'tipo_cliente', label: 'Tipo de cliente' },
      { key: 'tipo_solicitud', label: 'Tipo de solicitud' },
      { key: 'pais', label: 'País' },
      { key: 'departamento', label: 'Departamento' },
      { key: 'ciudad', label: 'Ciudad' },
      { key: 'solicitud', label: 'Solicitud' }
    ];
    
    const missing = requiredFields.filter(f => !form[f.key] || (typeof form[f.key] === 'string' && form[f.key].trim() === ''));
    if (missing.length > 0) {
      setError(`Falta completar el campo: ${missing[0].label}`);
      setLoading(false);
      return;
    }

    // Construir FormData
    const formData = new FormData();
    formData.append('customer_name', form.nombres);
    formData.append('tipo_identificacion', form.tipo_identificacion);
    formData.append('customer_identifier', form.identificacion);
    formData.append('email', form.email);
    formData.append('tipo_cliente', form.tipo_cliente);
    formData.append('request_type', form.tipo_solicitud);
    formData.append('country', form.pais);
    formData.append('departamento', form.departamento);
    formData.append('ciudad', form.ciudad);
    formData.append('message', form.solicitud);
    formData.append('subject', 'Solicitud desde formulario web');
    formData.append('tenant_id', form.tenant_id ? Number(form.tenant_id) : 1);
    formData.append('channel_id', form.channel_id ? Number(form.channel_id) : 1);
    formData.append('status_id', form.status_id ? Number(form.status_id) : 1);
    formData.append('created_by', 'webform');
    
    if (form.adjunto) {
      formData.append('adjunto', form.adjunto);
    }

    try {
      const response = await fetch(apiUrl('/api/requests'), {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        setSuccess(true);
        setForm({
          nombres: '',
          tipo_identificacion: '',
          identificacion: '',
          email: '',
          tipo_cliente: '',
          tipo_solicitud: '',
          pais: 'Colombia',
          departamento: '',
          ciudad: '',
          solicitud: '',
          adjunto: null,
          tenant_id: 1,
          channel_id: 1,
          status_id: 1
        });
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        const errorText = await response.text();
        setError('Error al enviar la solicitud: ' + errorText);
      }
    } catch (err) {
      setError('Error de conexión al backend: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (!window.confirm('¿Está seguro de limpiar el formulario? Se perderán todos los datos ingresados.')) {
      return;
    }
    
    setForm({
      nombres: '',
      tipo_identificacion: '',
      identificacion: '',
      email: '',
      tipo_cliente: '',
      tipo_solicitud: '',
      pais: 'Colombia',
      departamento: '',
      ciudad: '',
      solicitud: '',
      adjunto: null,
      tenant_id: 1,
      channel_id: 1,
      status_id: 1
    });
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: "Crear Solicitud" }
          ]}
        />

        {/* Header */}
        <Card shadow="md" padding="xl" radius="lg" withBorder style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none'
        }}>
          <Group gap="sm">
            <FileText size={40} strokeWidth={2} />
            <div>
              <Text size="xl" fw={700}>Nueva Solicitud</Text>
              <Text size="sm" style={{ opacity: 0.9 }}>Complete el formulario para crear una nueva solicitud</Text>
            </div>
          </Group>
        </Card>

        {/* Success Message */}
        {success && (
          <Notification 
            icon={<CheckCircle size={18} />} 
            color="teal" 
            title="¡Solicitud enviada!"
            onClose={() => setSuccess(false)}
          >
            La solicitud se ha creado correctamente. Redirigiendo...
          </Notification>
        )}

        {/* Error Message */}
        {error && (
          <Notification 
            icon={<AlertCircle size={18} />} 
            color="red" 
            title="Error"
            onClose={() => setError(null)}
          >
            {error}
          </Notification>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            {/* Información Personal */}
            <Card shadow="sm" padding="xl" radius="lg" withBorder>
              <Group gap="sm" mb="md">
                <User size={24} className="text-blue-600" />
                <Text size="lg" fw={600} c="blue">Información Personal</Text>
              </Group>
              
              <Stack gap="md">
                <TextInput
                  label="Nombres y Apellidos"
                  placeholder="Ingrese nombres y apellidos completos"
                  value={form.nombres}
                  onChange={(e) => handleChange('nombres', e.target.value)}
                  required
                  withAsterisk
                />

                <Group grow>
                  <Select
                    label="Tipo de Identificación"
                    placeholder="Seleccione"
                    value={form.tipo_identificacion}
                    onChange={(value) => handleChange('tipo_identificacion', value)}
                    data={[
                      { value: 'CC', label: 'Cédula de ciudadanía' },
                      { value: 'CE', label: 'Cédula de extranjería' },
                      { value: 'NIT', label: 'NIT' },
                      { value: 'PAS', label: 'Pasaporte' }
                    ]}
                    required
                    withAsterisk
                  />

                  <TextInput
                    label="Número de Identificación"
                    placeholder="Número de identificación"
                    value={form.identificacion}
                    onChange={(e) => handleChange('identificacion', e.target.value)}
                    required
                    withAsterisk
                  />
                </Group>

                <Group grow>
                  <TextInput
                    label="Correo Electrónico"
                    placeholder="correo@ejemplo.com"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    withAsterisk
                    leftSection={<Mail size={16} />}
                  />

                  <Select
                    label="Tipo de Cliente"
                    placeholder="Seleccione"
                    value={form.tipo_cliente}
                    onChange={(value) => handleChange('tipo_cliente', value)}
                    data={[
                      { value: 'natural', label: 'Persona Natural' },
                      { value: 'juridica', label: 'Persona Jurídica' }
                    ]}
                    required
                    withAsterisk
                  />
                </Group>
              </Stack>
            </Card>

            {/* Ubicación */}
            <Card shadow="sm" padding="xl" radius="lg" withBorder>
              <Group gap="sm" mb="md">
                <MapPin size={24} className="text-blue-600" />
                <Text size="lg" fw={600} c="blue">Ubicación</Text>
              </Group>
              
              <Stack gap="md">
                <Select
                  label="País"
                  placeholder="Seleccione"
                  value={form.pais}
                  onChange={(value) => handleChange('pais', value)}
                  data={[
                    { value: 'Colombia', label: 'Colombia' },
                    { value: 'Otro', label: 'Otro' }
                  ]}
                  required
                  withAsterisk
                />

                <Group grow>
                  <Select
                    label="Departamento"
                    placeholder="Seleccione un departamento"
                    value={form.departamento}
                    onChange={(value) => handleChange('departamento', value)}
                    data={Object.keys(DEPARTAMENTOS_COLOMBIA).map(dep => ({ value: dep, label: dep }))}
                    required
                    withAsterisk
                    searchable
                  />

                  <Select
                    label="Ciudad"
                    placeholder="Seleccione primero un departamento"
                    value={form.ciudad}
                    onChange={(value) => handleChange('ciudad', value)}
                    data={ciudadesDisponibles.map(ciudad => ({ value: ciudad, label: ciudad }))}
                    required
                    withAsterisk
                    disabled={!form.departamento}
                    searchable
                  />
                </Group>
              </Stack>
            </Card>

            {/* Detalles de la Solicitud */}
            <Card shadow="sm" padding="xl" radius="lg" withBorder>
              <Group gap="sm" mb="md">
                <FileText size={24} className="text-blue-600" />
                <Text size="lg" fw={600} c="blue">Detalles de la Solicitud</Text>
              </Group>
              
              <Stack gap="md">
                <Select
                  label="Tipo de Solicitud"
                  placeholder="Seleccione"
                  value={form.tipo_solicitud}
                  onChange={(value) => handleChange('tipo_solicitud', value)}
                  data={[
                    { value: 'consulta', label: 'Consulta' },
                    { value: 'reclamo', label: 'Reclamo' },
                    { value: 'peticion', label: 'Petición' },
                    { value: 'otro', label: 'Otro' }
                  ]}
                  required
                  withAsterisk
                />

                <Textarea
                  label="Descripción de la Solicitud"
                  placeholder="Describa detalladamente su solicitud..."
                  value={form.solicitud}
                  onChange={(e) => handleChange('solicitud', e.target.value)}
                  required
                  withAsterisk
                  minRows={5}
                />

                <div>
                  <FileInput
                    label="Archivos Adjuntos"
                    placeholder="Seleccionar archivo"
                    leftSection={<Upload size={16} />}
                    value={form.adjunto}
                    onChange={(file) => handleChange('adjunto', file)}
                    accept=".jpg,.png,.pdf"
                    description="Formatos permitidos: JPG, PNG, PDF (máx. 5MB)"
                  />
                  
                  {form.adjunto && (
                    <Group mt="xs" gap="xs">
                      <Badge 
                        variant="light" 
                        color="blue" 
                        size="lg"
                        rightSection={
                          <CloseButton 
                            size="xs" 
                            onClick={removeFile}
                            aria-label="Quitar archivo"
                            style={{ marginLeft: 4 }}
                          />
                        }
                      >
                        {form.adjunto.name}
                      </Badge>
                    </Group>
                  )}
                </div>
              </Stack>
            </Card>

            {/* Acciones */}
            <Card shadow="sm" padding="lg" radius="lg" withBorder>
              <Group justify="flex-end" gap="md">
                <Button 
                  variant="light" 
                  color="gray"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Limpiar formulario
                </Button>
                <Button 
                  type="submit" 
                  leftSection={loading ? <Loader size={16} /> : <CheckCircle size={16} />}
                  disabled={loading}
                  gradient={{ from: 'blue', to: 'grape', deg: 90 }}
                  variant="gradient"
                  size="md"
                >
                  {loading ? 'Enviando...' : 'Enviar Solicitud'}
                </Button>
              </Group>
            </Card>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default CrearSolicitud;
