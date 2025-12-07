import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Card, Grid, Text, Button, TextInput, Textarea,
    Group, Title, Badge, Stack, ActionIcon, ScrollArea,
    ThemeIcon, Divider, Box
} from "@mantine/core";
import {
    ArrowLeft, Save, FileText, Plus, Trash,
    CheckCircle2, GripVertical
} from "lucide-react";
import Breadcrumbs from "../../components/Breadcrumbs";
import { apiUrl } from "../../config/api";

export default function RequestAssignment() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Datos de la solicitud (Editables)
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_identifier: "",
        email: "",
        subject: "",
        management_notes: ""
    });

    // Bloques
    const [availableBlocks, setAvailableBlocks] = useState([]);
    const [selectedBlocks, setSelectedBlocks] = useState([]);

    useEffect(() => {
        // 1. Cargar Solicitud
        const p1 = fetch(apiUrl(`/api/requests/${id}`)).then(r => r.json());
        // 2. Cargar Bloques
        const p2 = fetch(apiUrl(`/api/blocks`))
            .then(r => r.ok ? r.json() : [])
            .catch(() => []); // Fallback silencioso si falla API bloques

        Promise.all([p1, p2])
            .then(([reqData, blocksData]) => {
                setFormData({
                    customer_name: reqData.customer_name || "",
                    customer_identifier: reqData.customer_identifier || "",
                    email: reqData.email || "",
                    subject: reqData.subject || "",
                    management_notes: ""
                });

                // Mock data si no hay bloques en DB aun para mostrar UI
                if (!blocksData || blocksData.length === 0) {
                    setAvailableBlocks([
                        { id: 101, name: 'Encabezado Formal', content: 'Bogotá D.C...' },
                        { id: 102, name: 'Saludo Corporativo', content: 'Estimado cliente...' },
                        { id: 103, name: 'Cuerpo: Respuesta Petición', content: 'En respuesta a...' },
                        { id: 104, name: 'Cuerpo: Respuesta Reclamo', content: 'Hemos analizado...' },
                        { id: 105, name: 'Cláusula Protección Datos', content: 'De acuerdo a la ley 1581...' },
                        { id: 106, name: 'Despedida Formal', content: 'Cordialmente...' },
                    ]);
                } else {
                    setAvailableBlocks(blocksData);
                }

                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando datos", err);
                setLoading(false);
            });
    }, [id]);

    const handleAddBlock = (block) => {
        // Permitir duplicados? Depende del workflow. Asumiré que sí (ej: dos parrafos de texto)
        // Pero generemos un ID temporal único para la lista UI
        const newItem = { ...block, ui_id: Date.now() + Math.random() };
        setSelectedBlocks([...selectedBlocks, newItem]);
    };

    const handleRemoveBlock = (uiId) => {
        setSelectedBlocks(selectedBlocks.filter(b => b.ui_id !== uiId));
    };

    const handleSave = () => {
        setSaving(true);
        // Simulación de guardado
        console.log("Guardando validación...", formData);
        console.log("Bloques pre-asignados:", selectedBlocks.map(b => b.id));

        // Aquí iría el fetch PUT con el cambio de estado a PENDIENTE CONSTRUCCIÓN (ID 4)

        setTimeout(() => {
            setSaving(false);
            // Volver a la lista de tareas
            navigate('/asignacion');
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <Group justify="space-between">
                    <Breadcrumbs items={[
                        { label: "Asignación", path: "/asignacion" },
                        { label: `Gestión #${id}` }
                    ]} />
                    <Button
                        variant="subtle"
                        leftSection={<ArrowLeft size={16} />}
                        onClick={() => navigate('/asignacion')}
                    >
                        Cancelar y Volver
                    </Button>
                </Group>

                <Group align="flex-start" justify="space-between">
                    <div>
                        <Title order={2} className="text-slate-800">Validación y Pre-forma</Title>
                        <Text c="dimmed">Corrija los datos inexactos y pre-seleccione los bloques para la etapa de construcción.</Text>
                    </div>
                    <Button
                        size="md"
                        leftSection={<Save size={18} />}
                        color="blue"
                        onClick={handleSave}
                        loading={saving}
                    >
                        Guardar y Pasar a Construcción
                    </Button>
                </Group>

                <Grid gutter="xl">
                    {/* Panel Izquierdo: Datos y Validación */}
                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <Card shadow="sm" radius="md" padding="lg" withBorder className="h-full">
                            <Card.Section withBorder inheritPadding py="md" bg="gray.0">
                                <Group>
                                    <ThemeIcon color="blue" variant="light"><CheckCircle2 size={18} /></ThemeIcon>
                                    <Text fw={600}>Validación de Datos</Text>
                                </Group>
                            </Card.Section>

                            <Stack mt="md" gap="md">
                                <TextInput
                                    label="Asunto"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                                <TextInput
                                    label="Nombre del Cliente"
                                    description="Corrija si el OCR leyó mal el nombre"
                                    value={formData.customer_name}
                                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                />
                                <Group grow>
                                    <TextInput
                                        label="Identificación"
                                        value={formData.customer_identifier}
                                        onChange={(e) => setFormData({ ...formData, customer_identifier: e.target.value })}
                                    />
                                    <TextInput
                                        label="Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </Group>

                                <Divider my="sm" label="Gestión Interna" labelPosition="center" />

                                <Textarea
                                    label="Notas de Gestión / Bitácora"
                                    placeholder="Ej: Se creó la orden de servicio #456 en SAP. Se validó dirección..."
                                    minRows={6}
                                    value={formData.management_notes}
                                    onChange={(e) => setFormData({ ...formData, management_notes: e.target.value })}
                                />
                            </Stack>
                        </Card>
                    </Grid.Col>

                    {/* Panel Derecho: Bloques (Pre-forma) */}
                    <Grid.Col span={{ base: 12, md: 7 }}>
                        <Card shadow="sm" radius="md" padding="lg" withBorder className="h-full">
                            <Card.Section withBorder inheritPadding py="md" bg="grape.0">
                                <Group justify="space-between">
                                    <Group>
                                        <ThemeIcon color="grape" variant="light"><FileText size={18} /></ThemeIcon>
                                        <Text fw={600}>Pre-forma del Documento</Text>
                                    </Group>
                                    <Badge variant="outline" color="grape">{selectedBlocks.length} bloques</Badge>
                                </Group>
                            </Card.Section>

                            <Grid gutter="md" mt="md" className="h-[500px]">
                                {/* Lista Disponibles */}
                                <Grid.Col span={6} className="h-full flex flex-col">
                                    <Text size="sm" fw={500} mb="xs" c="dimmed">Bloques Disponibles</Text>
                                    <Card withBorder padding="0" radius="md" className="flex-1 overflow-hidden">
                                        <ScrollArea h="100%">
                                            <Stack gap={0}>
                                                {availableBlocks.map(block => (
                                                    <Box
                                                        key={block.id}
                                                        p="sm"
                                                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                                                        onClick={() => handleAddBlock(block)}
                                                    >
                                                        <Group justify="space-between">
                                                            <Text size="sm" fw={500}>{block.name}</Text>
                                                            <ActionIcon variant="transparent" color="blue" size="sm">
                                                                <Plus size={16} />
                                                            </ActionIcon>
                                                        </Group>
                                                        <Text size="xs" c="dimmed" lineClamp={2}>
                                                            {block.content?.substring(0, 60)}...
                                                        </Text>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </ScrollArea>
                                    </Card>
                                </Grid.Col>

                                {/* Lista Seleccionados */}
                                <Grid.Col span={6} className="h-full flex flex-col">
                                    <Text size="sm" fw={500} mb="xs" c="dimmed">Estructura Seleccionada</Text>
                                    <Card withBorder padding="0" radius="md" className="flex-1 overflow-hidden bg-slate-50">
                                        <ScrollArea h="100%">
                                            {selectedBlocks.length === 0 ? (
                                                <div className="h-full flex items-center justify-center p-4 text-center">
                                                    <Text size="sm" c="dimmed">
                                                        Seleccione bloques del panel izquierdo para armar la preforma.
                                                    </Text>
                                                </div>
                                            ) : (
                                                <Stack gap="xs" p="xs">
                                                    {selectedBlocks.map((block, index) => (
                                                        <Card key={block.ui_id} shadow="sm" radius="md" p="sm" withBorder className="bg-white">
                                                            <Group justify="space-between" wrap="nowrap">
                                                                <Group gap="xs">
                                                                    <GripVertical size={14} className="text-gray-400 cursor-move" />
                                                                    <Text size="sm" fw={600} className="truncate">{block.name}</Text>
                                                                </Group>
                                                                <ActionIcon
                                                                    variant="subtle"
                                                                    color="red"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveBlock(block.ui_id)}
                                                                >
                                                                    <Trash size={14} />
                                                                </ActionIcon>
                                                            </Group>
                                                        </Card>
                                                    ))}
                                                </Stack>
                                            )}
                                        </ScrollArea>
                                    </Card>
                                </Grid.Col>
                            </Grid>
                        </Card>
                    </Grid.Col>
                </Grid>
            </div>
        </div>
    );
}
