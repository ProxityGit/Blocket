import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    TextInput,
    Select,
    Table,
    Badge,
    Group,
    Stack,
    Text,
    Loader,
    Pagination,
    ActionIcon,
    Tooltip,
} from "@mantine/core";
import {
    Search,
    Filter,
    FileText,
    Paperclip,
    Eye,
    Calendar,
    Mail,
    User,
    MapPin,
    ArrowUpDown
} from "lucide-react";
import { apiUrl } from "../config/api";
import Breadcrumbs from "./Breadcrumbs";
import RequestDetailsDrawer from "./RequestDetailsDrawer";
import { calculateBusinessDays } from "../utils/dateUtils";

export default function RequestsTable({
    title = "Solicitudes",
    subtitle = "Gestión de solicitudes",
    filterStatusId = null, // ID numérico: 3 (Asignar), 4 (Construir)
    targetRoute = "/constructor", // Ruta destino
    breadcrumbs = [],
    actionIcon = <FileText size={32} className="text-blue-600" />
}) {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filtroTipo, setFiltroTipo] = useState(null);

    const [sort, setSort] = useState('created_at');
    const [sortAsc, setSortAsc] = useState(true);

    const [solicitudes, setSolicitudes] = useState([]);
    const [solicitudesConAdjunto, setSolicitudesConAdjunto] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const getDaysColor = (days) => {
        if (days >= 15) return 'red';
        if (days >= 11) return 'orange';
        return 'teal';
    };

    useEffect(() => {
        setLoading(true);
        fetch(apiUrl("/api/requests"))
            .then(res => {
                if (!res.ok) throw new Error("Error al obtener solicitudes");
                return res.json();
            })
            .then(data => {
                // Filtrado por status_id
                const filteredByStatus = filterStatusId
                    ? data.filter(s => Number(s.status_id) === Number(filterStatusId))
                    : data;

                console.log(`Cargadas ${data.length} solicitudes. Filtradas por ID ${filterStatusId}: ${filteredByStatus.length}`);

                setSolicitudes(filteredByStatus);
                setLoading(false);
                return fetch(apiUrl("/api/attachments/all-ids"));
            })
            .then(res => {
                if (!res.ok) return [];
                return res.json().catch(() => []);
            })
            .then(adjuntosIds => {
                setSolicitudesConAdjunto(adjuntosIds);
            })
            .catch((err) => {
                console.error("Error cargando datos:", err);
                setError(err.message);
                setLoading(false);
            });
    }, [filterStatusId]);

    // Filtros locales (Búsqueda y Tipo)
    const filtradas = solicitudes.filter(
        (s) =>
            (!filtroTipo || (s.request_type && s.request_type === filtroTipo)) &&
            (
                !search ||
                (s.customer_name && s.customer_name.toLowerCase().includes(search.toLowerCase())) ||
                (s.email && s.email.toLowerCase().includes(search.toLowerCase())) ||
                (s.subject && s.subject.toLowerCase().includes(search.toLowerCase())) ||
                (s.ciudad && s.ciudad.toLowerCase().includes(search.toLowerCase())) ||
                (s.departamento && s.departamento.toLowerCase().includes(search.toLowerCase()))
            )
    );

    const sortedSolicitudes = [...filtradas].sort((a, b) => {
        if (!sort) return 0;

        let aVal = a[sort];
        let bVal = b[sort];

        if (sort === 'created_at') {
            aVal = new Date(aVal || 0).getTime();
            bVal = new Date(bVal || 0).getTime();
        } else {
            aVal = (aVal || '').toString().toLowerCase();
            bVal = (bVal || '').toString().toLowerCase();
        }

        if (aVal < bVal) return sortAsc ? -1 : 1;
        if (aVal > bVal) return sortAsc ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedSolicitudes.length / pageSize);
    const paginatedSolicitudes = sortedSolicitudes.slice((page - 1) * pageSize, page * pageSize);

    const handleShowAttachments = (request) => {
        setSelectedRequestId(request.id);
        setDrawerOpen(true);
    };

    const handleSort = (field) => {
        if (sort === field) {
            setSortAsc(!sortAsc);
        } else {
            setSort(field);
            setSortAsc(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <Breadcrumbs items={breadcrumbs.length > 0 ? breadcrumbs : [{ label: title }]} />

                <div className="mb-6">
                    <Group gap="sm" mb="xs">
                        {actionIcon}
                        <Text size="xl" fw={700} c="blue">{title}</Text>
                    </Group>
                    <Text size="sm" c="dimmed" ml={44}>
                        {subtitle}
                    </Text>
                </div>

                <Card shadow="sm" padding="lg" radius="lg" withBorder>
                    <Group gap="md">
                        <TextInput
                            placeholder="🔍 Buscar por cliente, email, asunto, ciudad..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            leftSection={<Search size={16} />}
                            style={{ flex: 1 }}
                        />
                        <Select
                            placeholder="Todos los tipos"
                            value={filtroTipo}
                            onChange={(value) => setFiltroTipo(value)}
                            data={[
                                { value: 'consulta', label: 'Consulta' },
                                { value: 'reclamo', label: 'Reclamo' },
                                { value: 'peticion', label: 'Petición' },
                                { value: 'otro', label: 'Otro' }
                            ]}
                            leftSection={<Filter size={16} />}
                            style={{ minWidth: 200 }}
                            clearable
                        />
                    </Group>
                </Card>

                {loading && (
                    <Card shadow="sm" padding="xl" radius="lg" withBorder>
                        <Group justify="center">
                            <Loader size="lg" />
                            <Text>Cargando solicitudes...</Text>
                        </Group>
                    </Card>
                )}

                {error && (
                    <Card shadow="sm" padding="xl" radius="lg" withBorder style={{ borderColor: 'red' }}>
                        <Text c="red" ta="center">Error: {error}</Text>
                    </Card>
                )}

                {!loading && !error && (
                    <Card shadow="sm" padding="lg" radius="lg" withBorder>
                        <Stack gap="md">
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Mostrando {paginatedSolicitudes.length} de {sortedSolicitudes.length} solicitudes
                                </Text>
                            </Group>

                            <Table.ScrollContainer minWidth={1200}>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>
                                                <Group gap="xs">ID <ArrowUpDown size={14} /></Group>
                                            </Table.Th>
                                            <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('created_at')}>
                                                <Group gap="xs">Fecha <ArrowUpDown size={14} /></Group>
                                            </Table.Th>
                                            <Table.Th ta="center">Días Hábiles</Table.Th>
                                            <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('customer_name')}>
                                                <Group gap="xs">Cliente <ArrowUpDown size={14} /></Group>
                                            </Table.Th>
                                            <Table.Th>Email</Table.Th>
                                            <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('request_type')}>
                                                <Group gap="xs">Tipo <ArrowUpDown size={14} /></Group>
                                            </Table.Th>
                                            <Table.Th>Ubicación</Table.Th>
                                            {/* Si no filtramos por estado, mostramos la columna Estado */}
                                            {!filterStatusId && <Table.Th>Estado</Table.Th>}
                                            <Table.Th ta="center">Detalle</Table.Th>
                                            <Table.Th ta="center">Gestionar</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {paginatedSolicitudes.map((s) => {
                                            const diasHabiles = s.created_at ? calculateBusinessDays(s.created_at) : 0;
                                            return (
                                                <Table.Tr
                                                    key={s.id}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => navigate(`${targetRoute}/${s.id}`)}
                                                >
                                                    <Table.Td>
                                                        <Text
                                                            ff="monospace"
                                                            fw={700}
                                                            c="dark"
                                                            size="sm"
                                                            className="text-slate-700 dark:text-slate-200"
                                                        >
                                                            {s.id}
                                                        </Text>
                                                    </Table.Td>

                                                    <Table.Td>
                                                        <Group gap="xs" wrap="nowrap">
                                                            <Calendar size={14} style={{ flexShrink: 0 }} />
                                                            <Text size="sm" style={{ whiteSpace: 'nowrap' }}>
                                                                {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}
                                                            </Text>
                                                        </Group>
                                                    </Table.Td>

                                                    <Table.Td ta="center">
                                                        <Badge
                                                            variant="filled"
                                                            color={getDaysColor(diasHabiles)}
                                                            size="lg"
                                                            style={{ minWidth: 40 }}
                                                        >
                                                            {diasHabiles}
                                                        </Badge>
                                                    </Table.Td>

                                                    <Table.Td>
                                                        <Group gap="xs" wrap="nowrap">
                                                            <User size={14} style={{ flexShrink: 0 }} />
                                                            <Text size="sm" fw={500} style={{ whiteSpace: 'nowrap' }}>{s.customer_name || "—"}</Text>
                                                        </Group>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Group gap="xs" wrap="nowrap">
                                                            <Mail size={14} style={{ flexShrink: 0 }} />
                                                            <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                                                                {s.email || "—"}
                                                            </Text>
                                                        </Group>
                                                    </Table.Td>
                                                    <Table.Td><Badge variant="light">{s.request_type || "—"}</Badge></Table.Td>
                                                    <Table.Td>
                                                        <Group gap="xs" wrap="nowrap">
                                                            <MapPin size={14} style={{ flexShrink: 0 }} />
                                                            <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                                                                {s.ciudad && s.departamento ? `${s.ciudad}, ${s.departamento}` : "—"}</Text>
                                                        </Group>
                                                    </Table.Td>

                                                    {!filterStatusId && (
                                                        <Table.Td>
                                                            <Badge variant="outline">{s.status_name || s.status_id}</Badge>
                                                        </Table.Td>
                                                    )}

                                                    <Table.Td ta="center">
                                                        <Tooltip label="Ver detalle completo">
                                                            <ActionIcon
                                                                variant="light"
                                                                color="blue"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleShowAttachments(s);
                                                                }}
                                                            >
                                                                {solicitudesConAdjunto.includes(s.id) ? <Paperclip size={16} /> : <FileText size={16} />}
                                                            </ActionIcon>
                                                        </Tooltip>
                                                    </Table.Td>
                                                    <Table.Td ta="center">
                                                        <Tooltip label="Gestionar Solicitud">
                                                            <ActionIcon
                                                                variant="filled"
                                                                color="blue"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`${targetRoute}/${s.id}`);
                                                                }}
                                                            >
                                                                <Eye size={16} />
                                                            </ActionIcon>
                                                        </Tooltip>
                                                    </Table.Td>
                                                </Table.Tr>
                                            );
                                        })}
                                    </Table.Tbody>
                                </Table>
                            </Table.ScrollContainer>

                            {paginatedSolicitudes.length === 0 && (
                                <Card shadow="xs" padding="xl" radius="md" withBorder style={{ textAlign: 'center' }}>
                                    <Text c="dimmed">⚪ No hay solicitudes que coincidan con los filtros actuales</Text>
                                </Card>
                            )}

                            {totalPages > 1 && (
                                <Group justify="center" mt="md">
                                    <Pagination
                                        total={totalPages}
                                        value={page}
                                        onChange={setPage}
                                        color="blue"
                                    />
                                </Group>
                            )}
                        </Stack>
                    </Card>
                )}
            </div>

            <RequestDetailsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                requestId={selectedRequestId}
            />
        </div>
    );
}
