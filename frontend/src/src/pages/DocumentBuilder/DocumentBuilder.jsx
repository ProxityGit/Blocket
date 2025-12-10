import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Button,
  Group,
  Stack,
  Text,
  Loader,
  Badge,
  Alert,
} from "@mantine/core";
import {
  FileText,
  FileDown,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react";
import "./DocumentBuilder.css";
import { OPCIONES_CONECTOR } from "../../data/mockConnectors";
import { extraerPlaceholders } from "../../utils/placeholders";
import { exportPDF } from "../../utils/pdfGenerator";
import { TENANT_CONFIG } from "../../data/tenantConfig";
import BlockList from "../../components/BlockList";
import DocumentEditor from "../../components/DocumentEditor";
import DynamicFields from "../../components/DynamicFields";
import LetterHeader from "../../components/LetterHeader";
import { apiUrl } from "../../config/api";
import Breadcrumbs from "../../components/Breadcrumbs";
import RequestDetailsDrawer from "../../components/RequestDetailsDrawer";

const LOCAL_STORAGE_KEY = 'blocket_header_config';

export default function DocumentBuilder() {
  const navigate = useNavigate();
  const { idSolicitud } = useParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [solicitud, setSolicitud] = useState(null);
  const [loadingSolicitud, setLoadingSolicitud] = useState(true);
  const [errorSolicitud, setErrorSolicitud] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [loadingBloques, setLoadingBloques] = useState(true);
  const [errorBloques, setErrorBloques] = useState(null);
  const [documento, setDocumento] = useState([]);
  const [camposValores, setCamposValores] = useState({});
  const [conectoresPorBloque, setConectoresPorBloque] = useState({});
  const [alerta, setAlerta] = useState("");
  const [exportando, setExportando] = useState(false);
  const docRef = useRef(null);

  // Estados para paneles colapsables
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  // Estado para la configuración del encabezado
  const [headerConfig, setHeaderConfig] = useState({
    logo_url: '',
    company_name: '',
    address: '',
    city: '',
    greeting: 'Cordial saludo',
    radicado_label: 'Radicado',
    identificador_label: 'Identificador',
    cargo_label: 'Cargo',
    show_radicado: true,
    show_identificador: true,
    show_cargo: false,
  });

  // Cargar configuración del encabezado
  useEffect(() => {
    const loadHeaderConfig = async () => {
      try {
        console.log('[DocumentBuilder] Cargando configuración del encabezado...');

        // Cargar desde localStorage primero (rápido)
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
          const parsedData = JSON.parse(localData);
          setHeaderConfig(parsedData);
        }

        // Luego desde API (actualización)
        const response = await fetch(apiUrl('/api/header-config?tenant_id=1'));
        if (response.ok) {
          const data = await response.json();
          setHeaderConfig(data);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        }
      } catch (error) {
        console.error('[DocumentBuilder] Error al cargar configuración:', error);
      }
    };

    loadHeaderConfig();
  }, []);

  // Permite reordenar los bloques por drag and drop
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newDocumento = Array.from(documento);
    const [moved] = newDocumento.splice(result.source.index, 1);
    newDocumento.splice(result.destination.index, 0, moved);
    setDocumento(newDocumento);
  };

  // Persistencia
  useEffect(() => {
    localStorage.setItem(
      "docfactory-data",
      JSON.stringify({ documento, camposValores, conectoresPorBloque })
    );
  }, [documento, camposValores, conectoresPorBloque]);

  useEffect(() => {
    const saved = localStorage.getItem("docfactory-data");
    if (saved) {
      const data = JSON.parse(saved);
      setDocumento(data.documento || []);
      setCamposValores(data.camposValores || {});
      setConectoresPorBloque(data.conectoresPorBloque || {});
    }

    // Obtener datos de la solicitud seleccionada
    setLoadingSolicitud(true);
    fetch(apiUrl(`/api/requests/${idSolicitud}`))
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo obtener la solicitud");
        return res.json();
      })
      .then((data) => {
        setSolicitud(data);
        setLoadingSolicitud(false);
        setErrorSolicitud(null);
      })
      .catch((err) => {
        setSolicitud(null);
        setLoadingSolicitud(false);
        setErrorSolicitud(err.message || "Error desconocido");
      });
  }, [idSolicitud]);

  // Cargar bloques desde la API
  useEffect(() => {
    setLoadingBloques(true);
    fetch(apiUrl('/api/blocks'))
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron obtener los bloques");
        return res.json();
      })
      .then((data) => {
        setBloques(data);
        setLoadingBloques(false);
        setErrorBloques(null);
      })
      .catch((err) => {
        setBloques([]);
        setLoadingBloques(false);
        setErrorBloques(err.message || "Error al cargar bloques");
      });
  }, []);

  const placeholdersFaltantes = () => {
    const keys = new Set();

    // Extraer todos los placeholders de los bloques en el documento
    for (const b of documento) {
      extraerPlaceholders(b.texto).forEach((k) => keys.add(k));
    }

    // Verificar cuáles faltan
    const faltan = [];
    keys.forEach((k) => {
      const v = camposValores[k];
      if ((k in camposValores && (v === undefined || String(v).trim() === "")) ||
        (!k in camposValores && keys.has(k))) {
        faltan.push(k);
      }
    });
    return faltan;
  };

  const renderParrafoConConector = (bloque) => {
    const conector = conectoresPorBloque[bloque.id] || "";
    let html = bloque.texto.trim();
    if (conector.trim()) {
      const limpio = conector.replace(/[.,;:\s]+$/g, "").trim();
      // Modifica la primera letra después del conector a minúscula
      html = html.replace(
        /<p([^>]*)>(\s*)([A-ZÁÉÍÓÚÑ])/i,
        (match, pAttrs, space, firstChar) => `<p${pAttrs}><span class="conector-inline">${limpio}, </span>${space}${firstChar.toLowerCase()}`
      );
    }
    // Reemplaza los placeholders por los valores actuales
    html = html.replace(/{{(.*?)}}/g, (match, key) => {
      const valor = camposValores[key];
      return valor !== undefined && valor !== null && valor.toString().trim() !== ""
        ? valor
        : `<span class="placeholder-pending">${key}</span>`;
    });
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const agregarBloque = (bloque) => {
    if (!documento.find((d) => d.id === bloque.id)) {
      setDocumento((prev) => [...prev, bloque]);
      setConectoresPorBloque((prev) => ({ ...prev, [bloque.id]: "" }));
    }
  };

  const quitarBloque = (index) => {
    const b = documento[index];
    setDocumento((prev) => prev.filter((_, i) => i !== index));
    setConectoresPorBloque((prev) => {
      const copia = { ...prev };
      delete copia[b.id];
      return copia;
    });
  };

  const actualizarCampo = (name, value) =>
    setCamposValores((s) => ({ ...s, [name]: value }));

  const actualizarConector = (blockId, value) =>
    setConectoresPorBloque((s) => ({ ...s, [blockId]: value }));

  const onExportClick = async () => {
    const faltan = placeholdersFaltantes();
    if (faltan.length > 0) {
      setAlerta(`Completa ${faltan.length} campo(s): ${faltan.join(", ")}`);
      return;
    }

    setAlerta("");
    setExportando(true);

    try {
      const nombreDocumento = solicitud
        ? `Documento_${solicitud.customer_name?.replace(/\s+/g, '_')}_${solicitud.id}`
        : 'Documento';

      const resultado = await exportPDF(docRef, nombreDocumento);

      if (resultado?.success) {
        setAlerta(`✅ PDF generado exitosamente: ${resultado.fileName} (${resultado.pages} página${resultado.pages > 1 ? 's' : ''})`);
        setTimeout(() => setAlerta(""), 5000);
      }
    } catch (error) {
      console.error('[DocumentBuilder] Error al exportar:', error);
      setAlerta(`❌ Error al generar el PDF: ${error.message}`);
    } finally {
      setExportando(false);
    }
  };

  const exportDisabled = placeholdersFaltantes().length > 0 || documento.length === 0 || exportando;

  const headerData = solicitud
    ? {
      logo: headerConfig.logo_url || TENANT_CONFIG.logo,
      nombreEmpresa: headerConfig.company_name || TENANT_CONFIG.nombreEmpresa,
      direccion: headerConfig.address || TENANT_CONFIG.direccion,
      ciudad: headerConfig.city || TENANT_CONFIG.ciudad,
      fecha: solicitud.created_at
        ? new Date(solicitud.created_at)
        : new Date(),
      destinatario: solicitud.customer_name || "—",
      identificacion: solicitud.customer_identifier || "—",
      cargo: solicitud.cargo || "Gerente General",
      radicado: solicitud.id || "—",
      asunto: solicitud.subject || "—",
      saludo: headerConfig.greeting || "Cordial saludo",
    }
    : {
      logo: headerConfig.logo_url || TENANT_CONFIG.logo,
      nombreEmpresa: headerConfig.company_name || TENANT_CONFIG.nombreEmpresa,
      direccion: headerConfig.address || TENANT_CONFIG.direccion,
      ciudad: headerConfig.city || TENANT_CONFIG.ciudad,
      fecha: new Date(),
      destinatario: "—",
      identificacion: "—",
      cargo: "Gerente General",
      radicado: "—",
      asunto: "—",
      saludo: headerConfig.greeting || "Cordial saludo",
    };

  return (
    <div className="constructor-container">
      <div style={{ padding: '32px 32px 24px 32px' }}>
        <Group justify="space-between" align="center">
          <Breadcrumbs
            items={[
              { label: "Listado de Solicitudes", path: "/consulta" },
              { label: "Constructor de Documentos" }
            ]}
          />
          <Group gap="xs">
            <Button
              variant="light"
              color="blue"
              leftSection={<Eye size={16} />}
              onClick={() => setDrawerOpen(true)}
            >
              Ver Solicitud
            </Button>
            <Button
              leftSection={<FileDown size={16} />}
              onClick={onExportClick}
              disabled={exportDisabled}
              loading={exportando}
              gradient={{ from: 'blue', to: 'grape', deg: 90 }}
              variant="gradient"
            >
              {exportando ? 'Generando PDF...' : 'Exportar PDF'}
            </Button>
          </Group>
        </Group>

        {alerta && (
          <Alert
            icon={<AlertCircle size={16} />}
            color={alerta.includes('✅') ? 'green' : alerta.includes('❌') ? 'red' : 'yellow'}
            mt="md"
          >
            {alerta}
          </Alert>
        )}
      </div>

      <div className={`constructor-layout ${leftPanelCollapsed ? 'left-collapsed' : ''} ${rightPanelCollapsed ? 'right-collapsed' : ''}`}>
        <aside className={`panel blocklist-panel ${leftPanelCollapsed ? 'collapsed' : ''}`}>
          <button
            className="collapse-btn collapse-btn-left"
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            title={leftPanelCollapsed ? "Expandir bloques" : "Colapsar bloques"}
          >
            {leftPanelCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          {!leftPanelCollapsed && (
            <>
              {loadingBloques ? (
                <Card shadow="sm" padding="xl" radius="lg" withBorder style={{ textAlign: 'center' }}>
                  <Stack gap="md" align="center">
                    <Loader size="lg" />
                    <Text c="dimmed">Cargando bloques...</Text>
                  </Stack>
                </Card>
              ) : errorBloques ? (
                <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
                  {errorBloques}
                </Alert>
              ) : (
                <BlockList
                  bloques={bloques}
                  documento={documento}
                  onAgregar={agregarBloque}
                />
              )}
            </>
          )}
        </aside>

        <main className="panel panel-documento">
          <DocumentEditor
            documento={documento}
            onDragEnd={onDragEnd}
            onQuitarBloque={quitarBloque}
            conectoresPorBloque={conectoresPorBloque}
            actualizarConector={actualizarConector}
            renderParrafoConConector={renderParrafoConConector}
            opcionesConector={OPCIONES_CONECTOR}
            alerta={alerta}
            docRef={docRef}
            tenantHeader={<LetterHeader header={headerData} />}
            camposValores={camposValores}
          />
        </main>

        <section className={`panel dynamic-panel ${rightPanelCollapsed ? 'collapsed' : ''}`}>
          <button
            className="collapse-btn collapse-btn-right"
            onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
            title={rightPanelCollapsed ? "Expandir campos" : "Colapsar campos"}
          >
            {rightPanelCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>

          {!rightPanelCollapsed && (
            <DynamicFields
              documento={documento}
              camposValores={camposValores}
              actualizarCampo={actualizarCampo}
            />
          )}
        </section>
      </div>

      <RequestDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        requestId={idSolicitud}
      />
    </div>
  );
}
