import { useState, useRef } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function App() {
  const bloques = [
    {
      id: 1,
      titulo: "Carta de bienvenida",
      texto:
        "Estimado {{nombreCliente}},\n\nLe damos la bienvenida a nuestro banco. Queremos agradecerle por confiar en nosotros y recordarle que nuestros asesores estarán disponibles en cualquier momento para resolver sus inquietudes.",
      campos: [{ name: "nombreCliente", label: "Nombre del cliente", type: "text" }],
    },
    {
      id: 2,
      titulo: "Aviso de mora",
      texto:
        "Estimado {{nombreCliente}},\n\nSu préstamo número {{numeroPrestamo}} presenta una mora de {{diasMora}} días. Le recordamos que es importante realizar el pago lo antes posible para evitar cargos adicionales y afectar su historial crediticio.",
      campos: [
        { name: "nombreCliente", label: "Nombre del cliente", type: "text" },
        { name: "numeroPrestamo", label: "Número de préstamo", type: "text" },
        { name: "diasMora", label: "Días de mora", type: "number" },
      ],
    },
    {
      id: 3,
      titulo: "Confirmación de pago",
      texto:
        "Nos complace informarle que hemos recibido el pago por valor de {{monto}} realizado el día {{fechaPago}}. Agradecemos su cumplimiento y le recordamos que puede consultar sus próximos vencimientos en la sucursal virtual o comunicarse con nuestro call center.",
      campos: [
        { name: "monto", label: "Monto pagado", type: "number" },
        { name: "fechaPago", label: "Fecha de pago", type: "date" },
      ],
    },
  ];

  const OPCIONES_CONECTOR = [
    "",
    "Adicionalmente,",
    "Por otra parte,",
    "En consecuencia,",
    "Cabe destacar que",
    "A su vez,",
    "Por lo anterior,",
  ];

  const [documento, setDocumento] = useState([]);
  const [camposValores, setCamposValores] = useState({});
  const [conectoresPorBloque, setConectoresPorBloque] = useState({}); // {[blockId]: string}
  const [alerta, setAlerta] = useState("");

  const docRef = useRef(null);

  // --- Utilidades ---
  const extraerPlaceholders = (texto) => {
    const m = texto.match(/{{(.*?)}}/g);
    return m ? m.map((x) => x.replace(/[{}]/g, "")) : [];
  };

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

  // En el render del bloque con conector: si hay conector, la PRIMERA letra de texto (no placeholder) va en minúscula
  const renderTexto = (texto, lowercaseFirst = false) => {
    let lowered = false;
    return texto.split(/({{.*?}})/g).map((part, idx) => {
      if (part.startsWith("{{") && part.endsWith("}}")) {
        // Placeholder
        const key = part.replace(/[{}]/g, "");
        const valor = camposValores[key];
        return (
          <span
            key={idx}
            className={valor ? "placeholder-filled" : "placeholder-pending"}
          >
            {valor || key}
          </span>
        );
      } else {
        // Texto plano
        if (lowercaseFirst && !lowered) {
          const i = part.search(/[A-Za-zÁÉÍÓÚÑÜáéíóúñü]/);
          if (i >= 0) {
            const ch = part[i];
            const lc = ch.toLocaleLowerCase();
            part = part.slice(0, i) + lc + part.slice(i + 1);
            lowered = true;
          }
        }
        return <span key={idx}>{part}</span>;
      }
    });
  };

  const renderParrafoConConector = (bloque) => {
    const conector = conectoresPorBloque[bloque.id] || "";
    const tieneConector = conector.trim() !== "";
    return (
      <>
        {tieneConector && <span className="conector-inline">{conector} </span>}
        {renderTexto(bloque.texto, /*lowercaseFirst*/ tieneConector)}
      </>
    );
  };

  // --- Acciones UI ---
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

  const actualizarCampo = (name, value) => {
    setCamposValores({ ...camposValores, [name]: value });
  };

  const actualizarConector = (blockId, value) => {
    setConectoresPorBloque((prev) => ({ ...prev, [blockId]: value }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(documento);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setDocumento(items);
  };

  // --- Exportar PDF con validación ---
  const onExportClick = async () => {
    const faltan = placeholdersFaltantes();
    if (faltan.length > 0) {
      setAlerta(
        `Completa ${faltan.length} campo(s) antes de exportar: ${faltan.join(", ")}`
      );
      return;
    }
    setAlerta("");
    await exportPDF();
  };

  const exportPDF = async () => {
    const el = docRef.current;
    if (!el) return;
    el.classList.add("print-mode");
    await new Promise((r) => setTimeout(r, 50));
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        pdf.addPage();
        position = -(imgHeight - heightLeft);
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save("documento.pdf");
    } finally {
      el.classList.remove("print-mode");
    }
  };

  const faltan = placeholdersFaltantes();
  const exportDisabled = faltan.length > 0 || documento.length === 0;

  return (
    <div>
      <header>📄 DocFactory – Constructor de Documentos</header>
      <div className="app-container">
        {/* Panel izquierdo */}
        <div className="sidebar">
          <div className="panel-title">
            <h3>🧩 Bloques disponibles</h3>
            <button
              className="btn-primary"
              onClick={onExportClick}
              disabled={exportDisabled}
              title={exportDisabled ? "Completa todos los campos para exportar" : "Exportar PDF"}
            >
              Exportar PDF
            </button>
          </div>

          {bloques.map((b) => {
            const yaUsado = documento.find((d) => d.id === b.id);
            return (
              <div
                key={b.id}
                className={`bloque-card ${yaUsado ? "disabled" : ""}`}
                onClick={() => !yaUsado && agregarBloque(b)}
              >
                <b>{b.titulo}</b>
                <p>{b.texto.slice(0, 90)}...</p>
              </div>
            );
          })}
        </div>

        {/* Panel central */}
        <div className="documento-panel">
          <div className="documento" ref={docRef}>
            <h1>Documento en construcción</h1>

            {alerta && <div className="alert">{alerta}</div>}

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="doc-bloques">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={snapshot.isDraggingOver ? "drop-area" : ""}
                  >
                    {documento.length === 0 && (
                      <p className="texto-placeholder">Selecciona bloques para empezar...</p>
                    )}

                    {documento.map((b, i) => (
                      <Draggable key={b.id} draggableId={String(b.id)} index={i}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={snapshot.isDragging ? "dragging" : ""}
                          >
                            {/* Selector SIEMPRE visible para cada bloque */}
                            <div className="selector-conector">
                              <label>Conector:</label>
                              <select
                                value={conectoresPorBloque[b.id] ?? ""}
                                onChange={(e) => actualizarConector(b.id, e.target.value)}
                              >
                                {OPCIONES_CONECTOR.map((c, idx) => (
                                  <option key={idx} value={c}>
                                    {c || "— Sin conector —"}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Párrafo del bloque (justificado) con conector aplicado */}
                            <p className="parrafo-bloque">
                              {renderParrafoConConector(b)}
                              <button
                                className="remove-btn"
                                onClick={() => quitarBloque(i)}
                              >
                                Quitar
                              </button>
                            </p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="fields-panel">
          <h3>✏️ Campos dinámicos</h3>
          {documento.length === 0 && (
            <p className="texto-placeholder">Agrega bloques para editar sus campos.</p>
          )}
          {documento.map((b) => (
            <div key={b.id} className="grupo-campos">
              <h4>{b.titulo}</h4>
              {b.campos.map((c) => (
                <div key={c.name} className="field">
                  <label>{c.label}</label>
                  <input
                    type={c.type}
                    value={camposValores[c.name] || ""}
                    onChange={(e) => actualizarCampo(c.name, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
