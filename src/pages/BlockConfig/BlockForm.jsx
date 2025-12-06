import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import HardBreak from '@tiptap/extension-hard-break';
import Breadcrumbs from "../../components/Breadcrumbs";
import Button from "../../components/Button";
import { Save, X, Plus } from 'lucide-react';
import { apiUrl } from "../../config/api";
import "./BlockForm.css";

export default function BlockForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = !!id;

  const [loading, setLoading] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [procesos, setProcesos] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    key: "",
    template_html: "",
    is_active: true,
    is_published: false,
    process_id: "",
    category_id: 1,
  });

  const [camposDinamicos, setCamposDinamicos] = useState([]);
  const [mostrarAgregarCampo, setMostrarAgregarCampo] = useState(false);
  const [menuContextual, setMenuContextual] = useState({ visible: false, x: 0, y: 0 });
  const [nuevoCampo, setNuevoCampo] = useState({
    name: "",
    label: "",
    type: "text",
    required: true,
  });

  // Configurar el editor TipTap
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,  // Deshabilitar bloques de código
        code: false,       // Deshabilitar código inline
      }),
      HardBreak.configure({
        keepMarks: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: formData.template_html,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData(prev => ({ ...prev, template_html: html }));
    },
  });

  useEffect(() => {
    cargarProcesos();
    if (esEdicion) {
      cargarBloque();
    }
  }, [id]);

  const cargarProcesos = async () => {
    try {
      const response = await fetch(apiUrl("/api/processes"));
      const data = await response.json();
      // Filtrar solo procesos activos
      const procesosActivos = data.filter(p => p.is_active);
      setProcesos(procesosActivos);

      // Si no hay proceso seleccionado y hay procesos disponibles, seleccionar el primero
      if (!formData.process_id && procesosActivos.length > 0) {
        setFormData(prev => ({ ...prev, process_id: procesosActivos[0].id }));
      }
    } catch (error) {
      console.error("Error al cargar procesos:", error);
    }
  };

  // Actualizar contenido del editor cuando se carga un bloque
  useEffect(() => {
    if (editor && formData.template_html) {
      editor.commands.setContent(formData.template_html);
    }
  }, [editor, loading]);

  // Cerrar menú contextual al hacer clic fuera o presionar ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        cerrarMenu();
      }
    };

    if (menuContextual.visible) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [menuContextual.visible]);

  const cargarBloque = async () => {
    try {
      const res = await fetch(apiUrl(`/api/blocks/${id}`));
      if (!res.ok) throw new Error("Error al cargar bloque");
      const data = await res.json();

      // Limpiar HTML: remover <pre> y <code> si existen
      let htmlLimpio = data.texto || "";

      // Si tiene <pre> o <code>, limpiar y convertir a párrafos
      if (htmlLimpio.includes('<pre') || htmlLimpio.includes('<code')) {
        htmlLimpio = htmlLimpio.replace(/<pre[^>]*>/gi, '');
        htmlLimpio = htmlLimpio.replace(/<\/pre>/gi, '');
        htmlLimpio = htmlLimpio.replace(/<code[^>]*>/gi, '');
        htmlLimpio = htmlLimpio.replace(/<\/code>/gi, '');

        // Convertir saltos de línea en párrafos si no hay etiquetas HTML
        if (!htmlLimpio.includes('<p') && !htmlLimpio.includes('<br')) {
          const lineas = htmlLimpio.split('\n').filter(l => l.trim());
          htmlLimpio = lineas.map(l => `<p>${l.trim()}</p>`).join('');
        }
      }

      setFormData({
        title: data.titulo || "",
        key: data.tipo || "",
        template_html: htmlLimpio,
        is_active: data.is_active !== undefined ? data.is_active : true,
        is_published: data.is_published !== undefined ? data.is_published : false,
        process_id: data.process_id || 1,
        category_id: data.category_id || 1,
      });

      setCamposDinamicos(data.campos || []);
      setLoading(false);
    } catch (err) {
      alert("Error: " + err.message);
      navigate("/configuracion/bloques");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;

    // Convertir process_id a número
    if (name === 'process_id' || name === 'category_id') {
      finalValue = value ? parseInt(value) : '';
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const insertarPlaceholder = (nombreCampo) => {
    if (editor) {
      const placeholder = `{{${nombreCampo}}} `;

      // Insertar como texto plano en la posición actual del cursor
      editor.chain().focus().insertContent(placeholder).run();
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();

    // Solo mostrar menú si hay campos dinámicos
    if (camposDinamicos.length === 0) {
      return;
    }

    setMenuContextual({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  const insertarDesdeMenu = (nombreCampo) => {
    insertarPlaceholder(nombreCampo);
    setMenuContextual({ visible: false, x: 0, y: 0 });
  };

  const cerrarMenu = () => {
    setMenuContextual({ visible: false, x: 0, y: 0 });
  };

  const agregarCampo = () => {
    if (!nuevoCampo.name || !nuevoCampo.label) {
      alert("Por favor completa nombre y etiqueta del campo");
      return;
    }

    // Verificar que el nombre no exista
    if (camposDinamicos.some(c => c.name === nuevoCampo.name)) {
      alert("Ya existe un campo con ese nombre");
      return;
    }

    setCamposDinamicos(prev => [...prev, { ...nuevoCampo, sort_order: prev.length + 1 }]);
    setNuevoCampo({ name: "", label: "", type: "text", required: true });
    setMostrarAgregarCampo(false);
  };

  const eliminarCampo = (index) => {
    setCamposDinamicos(prev => prev.filter((_, i) => i !== index));
  };

  const limpiarTablasTipTap = (html) => {
    // Crear un elemento temporal para manipular el HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Buscar todas las tablas
    const tablas = doc.querySelectorAll('table');

    tablas.forEach(tabla => {
      // Remover colgroup completo
      const colgroup = tabla.querySelector('colgroup');
      if (colgroup) {
        colgroup.remove();
      }

      // Simplificar atributos de la tabla
      tabla.removeAttribute('style');
      tabla.setAttribute('border', '1');
      tabla.setAttribute('cellpadding', '6');
      tabla.setAttribute('cellspacing', '0');
      tabla.setAttribute('style', 'border-collapse: collapse; width: 100%;');

      // Procesar tbody
      const tbody = tabla.querySelector('tbody');
      if (tbody) {
        // Procesar primera fila (headers)
        const firstRow = tbody.querySelector('tr');
        if (firstRow) {
          const headers = firstRow.querySelectorAll('th');
          headers.forEach(th => {
            // Remover atributos colspan/rowspan si son 1
            if (th.getAttribute('colspan') === '1') th.removeAttribute('colspan');
            if (th.getAttribute('rowspan') === '1') th.removeAttribute('rowspan');

            // Extraer texto del <p> interno si existe
            const p = th.querySelector('p');
            if (p) {
              th.innerHTML = p.innerHTML;
            }
          });

          // Agregar estilo a la fila de headers
          firstRow.setAttribute('style', 'background-color:#f2f4f7;');
        }

        // Procesar filas de datos
        const dataRows = tbody.querySelectorAll('tr:not(:first-child)');
        dataRows.forEach(row => {
          const cells = row.querySelectorAll('td');
          cells.forEach(td => {
            // Remover atributos colspan/rowspan si son 1
            if (td.getAttribute('colspan') === '1') td.removeAttribute('colspan');
            if (td.getAttribute('rowspan') === '1') td.removeAttribute('rowspan');

            // Extraer texto del <p> interno si existe
            const p = td.querySelector('p');
            if (p) {
              td.innerHTML = p.innerHTML.trim();
            }
          });

          // Eliminar filas vacías
          const isEmpty = Array.from(cells).every(cell => !cell.textContent.trim());
          if (isEmpty) {
            row.remove();
          }
        });
      }
    });

    return doc.body.innerHTML;
  };

  const guardarBloque = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.key || !formData.template_html) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    // Convertir \n a <br> para saltos de línea
    let htmlParaGuardar = formData.template_html;

    // Reemplazar \n dentro de elementos de texto por <br>
    htmlParaGuardar = htmlParaGuardar.replace(/\\n/g, '<br>');

    // Limpiar y simplificar tablas de TipTap
    htmlParaGuardar = limpiarTablasTipTap(htmlParaGuardar);

    // Debug: Ver el HTML que se va a guardar
    console.log('HTML original:', formData.template_html);
    console.log('HTML a guardar:', htmlParaGuardar);
    console.log('Campos dinámicos a guardar:', camposDinamicos);

    setGuardando(true);

    try {
      const url = apiUrl(esEdicion ? `/api/blocks/${id}` : '/api/blocks');
      const method = esEdicion ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        process_id: parseInt(formData.process_id) || null,
        category_id: parseInt(formData.category_id) || null,
        template_html: htmlParaGuardar,
        campos: camposDinamicos
      };

      console.log('Payload completo:', payload);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al guardar bloque");
      }

      alert(esEdicion ? "Bloque actualizado correctamente" : "Bloque creado correctamente");
      navigate("/configuracion/bloques");
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Cargando bloque...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Configuración", path: "/configuracion" },
            { label: "Bloques", path: "/configuracion/bloques" },
            { label: esEdicion ? "Editar Bloque" : "Nuevo Bloque" }
          ]}
        />

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
            {esEdicion ? 'Editar Bloque' : 'Nuevo Bloque'}
          </h1>
        </div>

        <form onSubmit={guardarBloque} className="block-form">
          <div className="form-section">
            <h2>Información General</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Título *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej: Carta de Bienvenida"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="key">Key (identificador único) *</label>
                <input
                  type="text"
                  id="key"
                  name="key"
                  value={formData.key}
                  onChange={handleChange}
                  placeholder="Ej: welcome_letter"
                  pattern="[a-z0-9_]+"
                  title="Solo letras minúsculas, números y guión bajo"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="process_id">Proceso *</label>
                <select
                  id="process_id"
                  name="process_id"
                  value={formData.process_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar proceso...</option>
                  {procesos.map(proceso => (
                    <option key={proceso.id} value={proceso.id}>
                      {proceso.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="checkbox-row">
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <label htmlFor="is_active">Activo</label>
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="is_published"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                />
                <label htmlFor="is_published">Publicado</label>
              </div>
            </div>
          </div>

          {/* Layout de 2 columnas: Campos dinámicos y Editor */}
          <div className="editor-layout">
            {/* Panel izquierdo: Campos dinámicos */}
            <div className="campos-panel">
              <div className="section-header">
                <h2>Campos Dinámicos ({camposDinamicos.length})</h2>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setMostrarAgregarCampo(!mostrarAgregarCampo)}
                >
                  {mostrarAgregarCampo ? '✖' : '➕'}
                </button>
              </div>

              {mostrarAgregarCampo && (
                <div className="add-field-form">
                  <div className="form-group">
                    <label htmlFor="field_name">Nombre *</label>
                    <input
                      type="text"
                      id="field_name"
                      value={nuevoCampo.name}
                      onChange={(e) => setNuevoCampo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="nombreCliente"
                      pattern="[a-zA-Z0-9_]+"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="field_label">Etiqueta *</label>
                    <input
                      type="text"
                      id="field_label"
                      value={nuevoCampo.label}
                      onChange={(e) => setNuevoCampo(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="Nombre del Cliente"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="field_type">Tipo</label>
                    <select
                      id="field_type"
                      value={nuevoCampo.type}
                      onChange={(e) => setNuevoCampo(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="text">Texto</option>
                      <option value="number">Número</option>
                      <option value="date">Fecha</option>
                      <option value="textarea">Área de texto</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={nuevoCampo.required}
                        onChange={(e) => setNuevoCampo(prev => ({ ...prev, required: e.target.checked }))}
                      />
                      Requerido
                    </label>
                  </div>

                  <Button
                    variant="primary"
                    fullWidth
                    onClick={agregarCampo}
                    icon={<Plus />}
                  >
                    Agregar Campo
                  </Button>
                </div>
              )}

              <div className="campos-list">
                <p className="help-text">
                  💡 Los campos se insertan con clic derecho en el editor
                </p>
                {camposDinamicos.length > 0 ? (
                  camposDinamicos.map((campo, index) => (
                    <div
                      key={index}
                      className="campo-item"
                    >
                      <div className="campo-info">
                        <strong>{`{{${campo.name}}}`}</strong>
                        <span>{campo.label}</span>
                        <span className="campo-type">{campo.type}</span>
                      </div>
                      <button
                        type="button"
                        className="btn-delete-campo"
                        onClick={() => eliminarCampo(index)}
                        title="Eliminar campo"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-campos">Sin campos dinámicos</p>
                )}
              </div>
            </div>

            {/* Panel derecho: Editor de texto enriquecido */}
            <div className="editor-panel">
              <div className="section-header">
                <h2>Contenido del Bloque *</h2>
              </div>

              {/* Barra de herramientas del editor */}
              <div className="editor-toolbar">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={editor?.isActive('bold') ? 'is-active' : ''}
                  title="Negrita"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={editor?.isActive('italic') ? 'is-active' : ''}
                  title="Cursiva"
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={editor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                  title="Título"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={editor?.isActive('bulletList') ? 'is-active' : ''}
                  title="Lista"
                >
                  • Lista
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setHardBreak().run()}
                  title="Salto de línea (también puedes usar Shift+Enter)"
                >
                  ↵ Salto
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                  title="Insertar Tabla"
                >
                  ⊞ Tabla
                </button>
                {editor?.isActive('table') && (
                  <>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().deleteTable().run()}
                      title="Eliminar Tabla"
                    >
                      ✕ Tabla
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().addColumnAfter().run()}
                      title="Agregar Columna"
                    >
                      + Col
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().addRowAfter().run()}
                      title="Agregar Fila"
                    >
                      + Fila
                    </button>
                  </>
                )}
              </div>

              {/* Editor de contenido */}
              <div
                className="editor-content"
                onContextMenu={handleContextMenu}
                onClick={cerrarMenu}
              >
                <EditorContent editor={editor} />
              </div>

              <small className="editor-help">
                💡 Haz clic derecho para insertar campos dinámicos | <strong>Enter</strong> = nuevo párrafo | <strong>Shift+Enter</strong> = salto de línea
              </small>
            </div>
          </div>

          <div className="form-actions">
            <Button
              variant="secondary"
              onClick={() => navigate("/configuracion/bloques")}
              icon={<X />}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={guardando}
              disabled={guardando}
              icon={<Save />}
            >
              {esEdicion ? 'Actualizar Bloque' : 'Crear Bloque'}
            </Button>
          </div>
        </form>

        {/* Menú contextual para insertar campos dinámicos */}
        {menuContextual.visible && (
          <>
            <div className="context-menu-overlay" onClick={cerrarMenu} />
            <div
              className="context-menu"
              style={{
                left: `${menuContextual.x}px`,
                top: `${menuContextual.y}px`
              }}
            >
              <div className="context-menu-header">Insertar Campo Dinámico</div>
              {camposDinamicos.map((campo, index) => (
                <button
                  key={index}
                  type="button"
                  className="context-menu-item"
                  onClick={() => insertarDesdeMenu(campo.name)}
                >
                  <span className="campo-icon">📝</span>
                  <div>
                    <div className="campo-name">{`{{${campo.name}}}`}</div>
                    <div className="campo-label">{campo.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
