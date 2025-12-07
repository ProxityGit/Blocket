import { useState, useEffect } from 'react';
import { Drawer, Text, ThemeIcon, Alert, Group, Badge, Stack, Loader, Button, Anchor } from '@mantine/core';
import { FileText, Paperclip, Download, Info } from 'lucide-react';
import { apiUrl } from '../config/api';

export default function RequestDetailsDrawer({ open, onClose, requestId }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        if (open && requestId) {
            loadData();
        }
    }, [open, requestId]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Obtener detalles de la solicitud
            const reqRes = await fetch(apiUrl(`/api/requests/${requestId}`));
            if (!reqRes.ok) throw new Error('No se pudo cargar la información de la solicitud');
            const reqData = await reqRes.json();

            // 2. Obtener adjuntos
            const attRes = await fetch(apiUrl(`/api/attachments/${requestId}`));
            let attData = [];
            if (attRes.ok) {
                attData = await attRes.json();
            }

            setData(reqData);
            setAttachments(attData);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getFileIcon = (mimeType) => {
        // Lógica simple para iconos, se puede expandir
        return <FileText size={20} />;
    };

    return (
        <Drawer
            opened={open}
            onClose={onClose}
            title={<Text fw={700} size="lg">Detalle de Solicitud #{requestId}</Text>}
            position="right"
            size="lg"
            padding="xl"
        >
            {loading ? (
                <Stack align="center" mt={50}>
                    <Loader size="lg" />
                    <Text c="dimmed">Cargando información...</Text>
                </Stack>
            ) : error ? (
                <Alert color="red" title="Error">
                    {error}
                </Alert>
            ) : data ? (
                <Stack gap="xl">
                    {/* Sección Mensaje del Cliente */}
                    <div>
                        <Group gap="xs" mb="sm">
                            <ThemeIcon variant="light" size="lg" color="blue">
                                <FileText size={20} />
                            </ThemeIcon>
                            <Text fw={600} size="md">Mensaje del Cliente</Text>
                        </Group>

                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                            {data.subject && (
                                <Text fw={700} mb="xs" size="sm">
                                    Asunto: {data.subject}
                                </Text>
                            )}
                            <Text style={{ whiteSpace: 'pre-wrap' }} size="sm" c="dimmed">
                                {data.message || data.description || "Sin mensaje disponible."}
                            </Text>
                        </div>
                    </div>

                    {/* Sección Adjuntos */}
                    <div>
                        <Group gap="xs" mb="sm">
                            <ThemeIcon variant="light" size="lg" color="teal">
                                <Paperclip size={20} />
                            </ThemeIcon>
                            <Text fw={600} size="md">Archivos Adjuntos ({attachments.length})</Text>
                        </Group>

                        {attachments.length === 0 ? (
                            <Text c="dimmed" fs="italic" size="sm">No hay archivos adjuntos.</Text>
                        ) : (
                            <Stack gap="sm">
                                {attachments.map((att) => (
                                    <div
                                        key={att.id}
                                        className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <ThemeIcon variant="light" color="gray" size="md">
                                                {getFileIcon(att.file_type)}
                                            </ThemeIcon>
                                            <div className="min-w-0">
                                                <Text size="sm" fw={500} truncate title={att.file_name}>
                                                    {att.file_name}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    {(att.file_size / 1024).toFixed(1)} KB
                                                </Text>
                                            </div>
                                        </div>

                                        <Button
                                            component="a"
                                            href={att.file_path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            variant="subtle"
                                            size="xs"
                                            leftSection={<Download size={14} />}
                                        >
                                            Descargar
                                        </Button>
                                    </div>
                                ))}
                            </Stack>
                        )}
                    </div>

                    {/* Metadatos extra (Opcional) */}
                    <div className="pt-4 border-t mt-4">
                        <Group justify="space-between">
                            <div>
                                <Text size="xs" c="dimmed">Cliente</Text>
                                <Text size="sm" fw={500}>{data.customer_name}</Text>
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">Fecha</Text>
                                <Text size="sm" fw={500}>{new Date(data.created_at).toLocaleDateString()}</Text>
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">Tipo</Text>
                                <Badge variant="light">{data.request_type}</Badge>
                            </div>
                        </Group>
                    </div>

                </Stack>
            ) : null}
        </Drawer>
    );
}
