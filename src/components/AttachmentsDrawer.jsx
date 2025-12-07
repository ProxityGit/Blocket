import React from "react";
import { Drawer, ScrollArea, Text, Group, ActionIcon, Stack, ThemeIcon } from "@mantine/core";
import { IconFile, IconDownload, IconX } from "@tabler/icons-react"; // O lucide-react, revisaré qué librería de iconos usa el proyecto
import { Download, FileText, X } from "lucide-react";
import { apiUrl } from "../config/api"; // Asegurarse de importar apiUrl

export default function AttachmentsDrawer({ open, onClose, attachments, description, subject }) {
  // Función helper para formatear tamaño
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <Drawer
      opened={open}
      onClose={onClose}
      title={<Text fw={700} size="lg">Detalle de Solicitud</Text>}
      position="right"
      size="lg" // Aumentar tamaño para leer mejor
      padding="xl"
      overlayProps={{ opacity: 0.5, blur: 4 }}
    >
      <ScrollArea h="calc(100vh - 80px)">
        <Stack gap="xl">
          {/* Sección de Texto de la Solicitud */}
          <div>
            <Group mb="xs">
              <ThemeIcon variant="light" color="blue" size="md">
                <FileText size={16} />
              </ThemeIcon>
              <Text fw={600} size="md">Mensaje del Cliente</Text>
            </Group>
            {subject && (
              <Text fw={500} mb="xs" style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px' }}>
                Asunto: {subject}
              </Text>
            )}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <Text size="sm" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {description || "Sin descripción disponible."}
              </Text>
            </div>
          </div>

          {/* Sección de Adjuntos */}
          <div>
            <Group mb="md">
              <ThemeIcon variant="light" color="teal" size="md">
                <Download size={16} />
              </ThemeIcon>
              <Text fw={600} size="md">Archivos Adjuntos ({attachments.length})</Text>
            </Group>

            {attachments.length === 0 ? (
              <Text c="dimmed" fs="italic" size="sm">
                No hay archivos adjuntos.
              </Text>
            ) : (
              <Stack gap="md">
                {attachments.map((att) => (
                  <Group
                    key={att.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    justify="space-between"
                    wrap="nowrap"
                  >
                    <Group gap="sm" style={{ overflow: 'hidden' }}>
                      <ThemeIcon variant="light" size="lg" color="gray">
                        <FileText size={20} />
                      </ThemeIcon>
                      <div style={{ minWidth: 0 }}>
                        <Text size="sm" fw={500} truncate title={att.file_name}>
                          {att.file_name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {formatSize(att.file_size)} • {att.mime_type?.split('/')[1] || 'Archivo'}
                        </Text>
                      </div>
                    </Group>

                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      component="a"
                      href={att.file_url || apiUrl(`/uploads/${att.file_name}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Download size={20} />
                    </ActionIcon>
                  </Group>
                ))}
              </Stack>
            )}
          </div>
        </Stack>
      </ScrollArea>
    </Drawer>
  );
}
