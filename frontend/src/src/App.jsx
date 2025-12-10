import { useState, useRef, useEffect } from "react";
import "./App.css";
import { BLOQUES } from "./data/mockBlocks";
import { OPCIONES_CONECTOR } from "./data/mockConnectors";
import { extraerPlaceholders } from "./utils/placeholders";
import { exportPDF } from "./utils/pdfGenerator";
import { TENANT_CONFIG } from "./data/tenantConfig";

import BlockList from "./components/BlockList";
import DocumentEditor from "./components/DocumentEditor";
import DynamicFields from "./components/DynamicFields";
import LetterHeader from "./components/LetterHeader";

function App() {
  const [documento, setDocumento] = useState([]);
  const [camposValores, setCamposValores] = useState({});
  const [conectoresPorBloque, setConectoresPorBloque] = useState({});
  const [alerta, setAlerta] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const docRef = useRef(null);

  // 🧠 Persistencia local
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
  }, []);

  // --- Utilidades ---
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

  // --- Render dinámico de bloques ---
  const renderParrafoConConector = (bloque) => {
    const conector = conectoresPorBloque[bloque.id] || "";
    const tieneConector = conector.trim() !== "";

    let html = bloque.texto.trim();

    if (tieneConector) {
      const conectorLimpio = conector.replace(/[.,;:\s]+$/g, "").trim();
      const conectorFormateado =
        conectorLimpio.charAt(0).toUpperCase() + conectorLimpio.slice(1).toLowerCase();

      html = html.replace(
        /<p([^>]*)>/i,
        `<p$1><span class="conector-inline"> ${conectorFormateado}, </span>`
      );

      html = html.replace(
        /(<p[^>]*>.*?<span class="conector-inline">.*?<\/span>\s*)(<b>|<strong>)?([A-ZÁÉÍÓÚÑ])/,
        (_, antes, etiqueta, letra) => `${antes}${etiqueta || ""}${letra.toLowerCase()}`
      );
    }

    // Procesa placeholders dinámicos
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const parts = text.split(/({{.*?}})/g);
        if (parts.length > 1) {
          const fragment = document.createDocumentFragment();
          parts.forEach((part) => {
            if (part.startsWith("{{") && part.endsWith("}}")) {
              const key = part.replace(/[{}]/g, "");
              const valor = camposValores[key];
              const span = document.createElement("span");
              span.className = valor
                ? "placeholder-filled"
                : "placeholder-pending";
              span.textContent = valor || key;
              fragment.appendChild(span);
            } else if (part) {
              fragment.appendChild(document.createTextNode(part));
            }
          });
          node.parentNode.replaceChild(fragment, node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(processNode);
      }
    };

    Array.from(tempDiv.childNodes).forEach(processNode);

    return <div dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }} />;
  };

  // --- Acciones ---
  const agregarBloque = (bloque) => {
    if (!documento.find((d) => d.id === bloque.id)) {
      setDocumento((prev) => [...prev, bloque]);
      if (conectoresPorBloque[bloque.id] === undefined) {
        setConectoresPorBloque((prev) => ({ ...prev, [bloque.id]: "" }));
      }
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
    setCamposValores({ ...camposValores, [name]: value });

  const actualizarConector = (blockId, value) =>
    setConectoresPorBloque((prev) => ({ ...prev, [blockId]: value }));

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(documento);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setDocumento(items);
  };

  const onExportClick = async () => {
    const faltan = placeholdersFaltantes();
    if (faltan.length > 0) {
      setAlerta(`Completa ${faltan.length} campo(s): ${faltan.join(", ")} antes de exportar`);
      return;
    }
    setAlerta("");
    await exportPDF(docRef);
  };

  const exportDisabled =
    placeholdersFaltantes().length > 0 || documento.length === 0;

  // --- Render principal ---
  return (
    <div>
      <header className="app-header">
        <h1>📄 Blocket – Constructor de Documentos</h1>
        <div className="app-actions">
          <button className="btn-light" onClick={() => setShowPreview(true)}>
            👁️ Vista Previa
          </button>
          <button
            className="btn-primary"
            onClick={onExportClick}
            disabled={exportDisabled}
          >
            📄 Exportar PDF
          </button>
        </div>
      </header>

      <div className="app-container">
        {/* Panel izquierdo */}
        <BlockList
          bloques={BLOQUES}
          documento={documento}
          onAgregar={agregarBloque}
        />

        {/* Panel central */}
        <div className="panel-documento">
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
            tenantHeader={<LetterHeader header={TENANT_CONFIG} />}
          />
        </div>

        {/* Panel derecho */}
        <DynamicFields
          documento={documento}
          camposValores={camposValores}
          actualizarCampo={actualizarCampo}
        />
      </div>

     
    </div>
  );
}

export default App;
