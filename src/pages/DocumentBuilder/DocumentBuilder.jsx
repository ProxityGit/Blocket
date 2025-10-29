import { useState, useRef, useEffect } from "react";
import "./DocumentBuilder.css";
import { BLOQUES } from "../../data/mockBlocks";
import { OPCIONES_CONECTOR } from "../../data/mockConnectors";
import { extraerPlaceholders } from "../../utils/placeholders";
import { exportPDF } from "../../utils/pdfGenerator";
import { TENANT_CONFIG } from "../../data/tenantConfig";
import BlockList from "../../components/BlockList";
import DocumentEditor from "../../components/DocumentEditor";
import DynamicFields from "../../components/DynamicFields";
import LetterHeader from "../../components/LetterHeader";
import PreviewModal from "../../components/PreviewModal";
import { useParams } from "react-router-dom";

export default function DocumentBuilder() {
  const { idSolicitud } = useParams();
  const [documento, setDocumento] = useState([]);
  const [camposValores, setCamposValores] = useState({});
  const [conectoresPorBloque, setConectoresPorBloque] = useState({});
  const [alerta, setAlerta] = useState("");
  // Siempre inicia en false y nunca se sobreescribe por localStorage ni props
  const [showPreview, setShowPreview] = useState(false);
  const docRef = useRef(null);

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
    // Siempre reinicia showPreview al cambiar de solicitud
    setShowPreview(false);
  }, [idSolicitud]);

  const placeholdersFaltantes = () => {
    const keys = new Set();
    for (const b of documento) {
      extraerPlaceholders(b.texto).forEach((k) => keys.add(k));
    }
    const faltan = [];
    keys.forEach((k) => {
      const v = camposValores[k];
      if (v === undefined || String(v).trim() === "") faltan.push(k);
    });
    return faltan;
  };

  const renderParrafoConConector = (bloque) => {
    const conector = conectoresPorBloque[bloque.id] || "";
    let html = bloque.texto.trim();
    if (conector.trim()) {
      const limpio = conector.replace(/[.,;:\s]+$/g, "").trim();
      html = html.replace(
        /<p([^>]*)>/i,
        `<p$1><span class="conector-inline">${limpio}, </span>`
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
    await exportPDF(docRef);
  };

  const exportDisabled = placeholdersFaltantes().length > 0 || documento.length === 0;

  console.log("[DEBUG] Render DocumentBuilder, showPreview:", showPreview);
  return (
    <div className="constructor-container">
      <header className="constructor-header">
        <div>
          <h1>🧩 Constructor de Documentos</h1>
          <p>Combina bloques inteligentes y genera tu documento final.</p>
        </div>

        <div className="header-actions">
          <button className="btn-light" onClick={() => { console.log('[DEBUG] Click Vista Previa'); setShowPreview(true); }}>
            👁️ Vista Previa
          </button>
          <button className="btn-primary" onClick={onExportClick} disabled={exportDisabled}>
            📄 Exportar PDF
          </button>
        </div>
      </header>

      <div className="constructor-layout">
        <aside className="panel blocklist-panel">
          <BlockList
            bloques={BLOQUES}
            documento={documento}
            onAgregar={agregarBloque}
          />
        </aside>

        <main className="panel panel-documento">
          <DocumentEditor
            documento={documento}
            onQuitarBloque={quitarBloque}
            conectoresPorBloque={conectoresPorBloque}
            actualizarConector={actualizarConector}
            renderParrafoConConector={renderParrafoConConector}
            opcionesConector={OPCIONES_CONECTOR}
            alerta={alerta}
            docRef={docRef}
            tenantHeader={<LetterHeader header={TENANT_CONFIG} />}
            camposValores={camposValores}
          />
        </main>

        <section className="panel dynamic-panel">
          <DynamicFields
            documento={documento}
            camposValores={camposValores}
            actualizarCampo={actualizarCampo}
          />
        </section>
      </div>

      {/* 🔒 Modal controlado: solo existe si showPreview=true */}
      <PreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        documento={documento}
        renderParrafoConConector={renderParrafoConConector}
        camposValores={camposValores}
        tenantHeader={<LetterHeader header={TENANT_CONFIG} />}
      />
    </div>
  );
}
