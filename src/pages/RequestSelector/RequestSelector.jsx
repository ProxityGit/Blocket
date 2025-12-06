import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
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
import { apiUrl } from "../../config/api";
import Breadcrumbs from "../../components/Breadcrumbs";
import AttachmentsDrawer from "../../components/AttachmentsDrawer";

export default function RequestSelector() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filtroTipo, setFiltroTipo] = useState(null);
  const [sort, setSort] = useState('id');
  const [sortAsc, setSortAsc] = useState(false);

  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudesConAdjunto, setSolicitudesConAdjunto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAttachments, setDrawerAttachments] = useState([]);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filtros y paginación
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

  // Aplicar sorting
  const sortedSolicitudes = [...filtradas].sort((a, b) => {
    if (!sort) return 0;
    const aVal = a[sort] || '';
    const bVal = b[sort] || '';
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedSolicitudes.length / pageSize);
  const paginatedSolicitudes = sortedSolicitudes.slice((page-1)*pageSize, page*pageSize);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(apiUrl("/api/requests")).then(res => {
        if (!res.ok) throw new Error("Error al obtener solicitudes");
        return res.json();
      }),
      fetch(apiUrl("/api/attachments/all-ids")).then(res => {
        if (!res.ok) return [];
        return res.json().catch(() => []);
      })
    ])
      .then(([sols, adjuntos]) => {
        setSolicitudes(sols);
        setSolicitudesConAdjunto(adjuntos);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setSolicitudesConAdjunto([]);
        setLoading(false);
      });
  }, []);

  const handleShowAttachments = async (requestId) => {
    setDrawerOpen(true);
    setDrawerLoading(true);
    setDrawerError(null);
    try {
      const res = await fetch(apiUrl(`/api/attachments/${requestId}`));
      if (!res.ok) throw new Error("Error al obtener adjuntos");
      const data = await res.json();
      setDrawerAttachments(data);
    } catch (err) {
      setDrawerError(err.message);
      setDrawerAttachments([]);
    }
    setDrawerLoading(false);
  };

  const handleSort = (field) => {
    if (sort === field) {
      setSortAsc(!sortAsc);
    } else {
      setSort(field);
      setSortAsc(true);
    }
  };

  const getStatusBadge = (statusId) => {
    const statusMap = {
      1: { label: 'Recibida', color: 'blue' },
      2: { label: 'Pendiente', color: 'yellow' },
      3: { label: 'Integrada', color: 'green' },
      4: { label: 'Error', color: 'red' },
      5: { label: 'Enviada', color: 'teal' }
    };
    const status = statusMap[statusId] || { label: 'Desconocido', color: 'gray' };
    return <Badge color={status.color} size="sm">{status.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: "Consulta de Solicitudes" }
          ]}
        />

        {/* Header - sin contenedor */}
        <div className="mb-6">
          <Group gap="sm" mb="xs">
            <FileText size={32} className="text-blue-600" />
            <Text size="xl" fw={700} c="blue">Solicitudes Pendientes de Construcción</Text>
          </Group>
          <Text size="sm" c="dimmed" ml={44}>
            Selecciona una solicitud para abrir el constructor de documentos
          </Text>
        </div>

        {/* Filtros */}
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

        {/* Loading state */}
        {loading && (
          <Card shadow="sm" padding="xl" radius="lg" withBorder>
            <Group justify="center">
              <Loader size="lg" />
              <Text>Cargando solicitudes...</Text>
            </Group>
          </Card>
        )}

        {/* Error state */}
        {error && (
          <Card shadow="sm" padding="xl" radius="lg" withBorder style={{ borderColor: 'red' }}>
            <Text c="red" ta="center">Error: {error}</Text>
          </Card>
        )}

        {/* Tabla de solicitudes */}
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
                        <Group gap="xs">
                          ID <ArrowUpDown size={14} />
                        </Group>
                      </Table.Th>
                      <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('created_at')}>
                        <Group gap="xs">
                          Fecha <ArrowUpDown size={14} />
                        </Group>
                      </Table.Th>
                      <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('customer_name')}>
                        <Group gap="xs">
                          Cliente <ArrowUpDown size={14} />
                        </Group>
                      </Table.Th>
                      <Table.Th>Email</Table.Th>
                      <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('request_type')}>
                        <Group gap="xs">
                          Tipo <ArrowUpDown size={14} />
                        </Group>
                      </Table.Th>
                      <Table.Th>Estado</Table.Th>
                      <Table.Th>Ubicación</Table.Th>
                      <Table.Th>Asunto</Table.Th>
                      <Table.Th ta="center">Adjuntos</Table.Th>
                      <Table.Th ta="center">Acciones</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {paginatedSolicitudes.map((s) => (
                      <Table.Tr 
                        key={s.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/constructor/${s.id}`)}
                      >
                        <Table.Td>
                          <Badge variant="light" color="gray">#{s.id}</Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Calendar size={14} />
                            <Text size="sm">
                              {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <User size={14} />
                            <Text size="sm">{s.customer_name || "—"}</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Mail size={14} />
                            <Text size="xs" c="dimmed">{s.email || "—"}</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="light">{s.request_type || "—"}</Badge>
                        </Table.Td>
                        <Table.Td>{getStatusBadge(s.status_id)}</Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <MapPin size={14} />
                            <Text size="xs" c="dimmed">
                              {s.ciudad && s.departamento ? `${s.ciudad}, ${s.departamento}` : "—"}
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="xs" lineClamp={2}>{s.subject || "—"}</Text>
                        </Table.Td>
                        <Table.Td ta="center">
                          {solicitudesConAdjunto.includes(s.id) ? (
                            <Tooltip label="Ver adjuntos">
                              <ActionIcon
                                variant="light"
                                color="blue"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShowAttachments(s.id);
                                }}
                              >
                                <Paperclip size={16} />
                              </ActionIcon>
                            </Tooltip>
                          ) : (
                            <Text size="xs" c="dimmed">—</Text>
                          )}
                        </Table.Td>
                        <Table.Td ta="center">
                          <Tooltip label="Ver detalles">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              onClick={() => navigate(`/constructor/${s.id}`)}
                            >
                              <Eye size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>

              {/* Empty state */}
              {paginatedSolicitudes.length === 0 && (
                <Card shadow="xs" padding="xl" radius="md" withBorder style={{ textAlign: 'center' }}>
                  <Text c="dimmed">⚪ No hay solicitudes que coincidan con los filtros actuales</Text>
                </Card>
              )}

              {/* Paginación */}
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

      {/* Drawer de adjuntos */}
      <AttachmentsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        attachments={drawerAttachments}
      />
      {drawerLoading && drawerOpen && (
        <Card 
          shadow="md" 
          padding="md" 
          radius="md" 
          style={{ position: 'fixed', right: 370, top: 40, zIndex: 1100 }}
        >
          <Group gap="xs">
            <Loader size="sm" />
            <Text size="sm">Cargando adjuntos...</Text>
          </Group>
        </Card>
      )}
      {drawerError && drawerOpen && (
        <Card 
          shadow="md" 
          padding="md" 
          radius="md" 
          style={{ position: 'fixed', right: 370, top: 80, zIndex: 1100, borderColor: 'red' }}
        >
          <Text size="sm" c="red">Error: {drawerError}</Text>
        </Card>
      )}
    </div>
  );
}
