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
      const procesosActivos = data.filter(p => p.is_active);
      setProcesos(procesosActivos);

      if (!formData.process_id && procesosActivos.length > 0) {
        setFormData(prev => ({ ...prev, process_id: procesosActivos[0].id }));
      }
    } catch (error) {
      console.error("Error al cargar procesos:", error);
    }
  };

  useEffect(() => {
    if (editor && formData.template_html) {
      // Solo actualizar si el contenido es significativamente diferente para evitar bucles
      if (editor.getHTML() !== formData.template_html) {
        editor.commands.setContent(formData.template_html);
      }
    }
  }, [editor, loading, formData.template_html]);

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

      let htmlLimpio = data.texto || "";
      if (htmlLimpio.includes('<pre') || htmlLimpio.includes('<code')) {
        htmlLimpio = htmlLimpio.replace(/<pre[^>]*>/gi, '').replace(/<\/pre>/gi, '')
          .replace(/<code[^>]*>/gi, '').replace(/<\/code>/gi, '');
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

    if (name === 'process_id' || name === 'category_id') {
      finalValue = value ? parseInt(value) : '';
    }

    setFormData(prev => {
      const newData = { ...prev, [name]: finalValue };

      // key autogenerada si cambia el título
      if (name === 'title') {
        newData.key = value
          .toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-_]/g, '')
          .trim()
          .replace(/\s+/g, '_');
      }
      return newData;
    });
  };

  const insertarPlaceholder = (nombreCampo) => {
    if (editor) {
      editor.chain().focus().insertContent(`{{${nombreCampo}}} `).run();
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (camposDinamicos.length === 0) return;
    setMenuContextual({ visible: true, x: e.clientX, y: e.clientY });
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
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const tablas = doc.querySelectorAll('table');

    tablas.forEach(tabla => {
      const colgroup = tabla.querySelector('colgroup');
      if (colgroup) colgroup.remove();
      tabla.removeAttribute('style');
      tabla.setAttribute('border', '1');
      tabla.setAttribute('cellpadding', '6');
      tabla.setAttribute('cellspacing', '0');
      tabla.setAttribute('style', 'border-collapse: collapse; width: 100%;');

      const tbody = tabla.querySelector('tbody');
      if (tbody) {
        const firstRow = tbody.querySelector('tr');
        if (firstRow) {
          firstRow.querySelectorAll('th').forEach(th => {
            if (th.getAttribute('colspan') === '1') th.removeAttribute('colspan');
            if (th.getAttribute('rowspan') === '1') th.removeAttribute('rowspan');
            const p = th.querySelector('p');
            if (p) th.innerHTML = p.innerHTML;
          });
          firstRow.setAttribute('style', 'background-color:#f2f4f7;');
        }
        tbody.querySelectorAll('tr:not(:first-child)').forEach(row => {
          const cells = row.querySelectorAll('td');
          cells.forEach(td => {
            if (td.getAttribute('colspan') === '1') td.removeAttribute('colspan');
            if (td.getAttribute('rowspan') === '1') td.removeAttribute('rowspan');
            const p = td.querySelector('p');
            if (p) td.innerHTML = p.innerHTML.trim();
          });
          if (Array.from(cells).every(cell => !cell.textContent.trim())) {
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

    let htmlParaGuardar = formData.template_html.replace(/\\n/g, '<br>');
    htmlParaGuardar = limpiarTablasTipTap(htmlParaGuardar);
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

  if (loading) return <div className="loading-container">Cargando bloque...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs items={[
          { label: "Configuración", path: "/configuracion" },
          { label: "Bloques", path: "/configuracion/bloques" },
          { label: esEdicion ? "Editar Bloque" : "Nuevo Bloque" }
        ]} />

        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
            {esEdicion ? 'Editar Bloque' : 'Nuevo Bloque'}
          </h1>
        </div>

        <form onSubmit={guardarBloque} className="block-form">
          <div className="form-section">
            <h2>Información General</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <div className="form-group">
                <label htmlFor="status">Estado</label>
                <select
                  id="status"
                  value={
                    !formData.is_active ? "Inactivo" :
                      formData.is_published ? "Publicado" :
                        "Borrador"
                  }
                  onChange={(e) => {
                    const status = e.target.value;
                    let is_active = true;
                    let is_published = false;
                    switch (status) {
                      case "Publicado": is_active = true; is_published = true; break;
                      case "Inactivo":
                      case "Obsoleto": is_active = false; is_published = false; break;
                      case "Borrador":
                      case "En revisión":
                      default: is_active = true; is_published = false; break;
                    }
                    setFormData(prev => ({ ...prev, is_active, is_published }));
                  }}
                >
                  <option value="Borrador">Borrador</option>
                  <option value="En revisión">En revisión</option>
                  <option value="Publicado">Publicado</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Obsoleto">Obsoleto</option>
                </select>
              </div>
            </div>
          </div>

          <div className="editor-layout">
            <div className="campos-panel">
              <div className="section-header">
                <h2>Campos Dinámicos ({camposDinamicos.length})</h2>
                <button type="button" className="btn-secondary" onClick={() => setMostrarAgregarCampo(!mostrarAgregarCampo)}>
                  {mostrarAgregarCampo ? '✖' : '➕'}
                </button>
              </div>

              {mostrarAgregarCampo && (
                <div className="add-field-form">
                  <div className="form-group">
                    <label htmlFor="field_name">Nombre *</label>
                    <input type="text" id="field_name" value={nuevoCampo.name} onChange={(e) => setNuevoCampo(prev => ({ ...prev, name: e.target.value }))} placeholder="nombreCliente" pattern="[a-zA-Z0-9_]+" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="field_label">Etiqueta *</label>
                    <input type="text" id="field_label" value={nuevoCampo.label} onChange={(e) => setNuevoCampo(prev => ({ ...prev, label: e.target.value }))} placeholder="Nombre del Cliente" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="field_type">Tipo</label>
                    <select id="field_type" value={nuevoCampo.type} onChange={(e) => setNuevoCampo(prev => ({ ...prev, type: e.target.value }))}>
                      <option value="text">Texto</option>
                      <option value="number">Número</option>
                      <option value="date">Fecha</option>
                      <option value="textarea">Área de texto</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>
                      <input type="checkbox" checked={nuevoCampo.required} onChange={(e) => setNuevoCampo(prev => ({ ...prev, required: e.target.checked }))} /> Requerido
                    </label>
                  </div>
                  <Button variant="primary" fullWidth onClick={agregarCampo} icon={<Plus />}>Agregar Campo</Button>
                </div>
              )}

              <div className="campos-list">
                <p className="help-text">💡 Los campos se insertan con clic derecho en el editor</p>
                {camposDinamicos.length > 0 ? (
                  camposDinamicos.map((campo, index) => (
                    <div key={index} className="campo-item">
                      <div className="campo-info">
                        <strong>{`{{${campo.name}}}`}</strong>
                        <span>{campo.label}</span>
                        <span className="campo-type">{campo.type}</span>
                      </div>
                      <button type="button" className="btn-delete-campo" onClick={() => eliminarCampo(index)} title="Eliminar campo">✕</button>
                    </div>
                  ))
                ) : (<p className="no-campos">Sin campos dinámicos</p>)}
              </div>
            </div>

            <div className="editor-panel">
              <div className="section-header"><h2>Contenido del Bloque *</h2></div>
              <div className="editor-toolbar">
                <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'is-active' : ''} title="Negrita"><strong>B</strong></button>
                <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'is-active' : ''} title="Cursiva"><em>I</em></button>
                <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={editor?.isActive('heading', { level: 3 }) ? 'is-active' : ''} title="Título">H3</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'is-active' : ''} title="Lista">• Lista</button>
                <button type="button" onClick={() => editor?.chain().focus().setHardBreak().run()} title="Salto de línea">↵ Salto</button>
                <button type="button" onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insertar Tabla">⊞ Tabla</button>
                {editor?.isActive('table') && (
                  <>
                    <button type="button" onClick={() => editor?.chain().focus().deleteTable().run()} title="Eliminar Tabla">✕ Tabla</button>
                    <button type="button" onClick={() => editor?.chain().focus().addColumnAfter().run()} title="Agregar Columna">+ Col</button>
                    <button type="button" onClick={() => editor?.chain().focus().addRowAfter().run()} title="Agregar Fila">+ Fila</button>
                  </>
                )}
              </div>
              <div className="editor-content" onContextMenu={handleContextMenu} onClick={cerrarMenu}>
                <EditorContent editor={editor} />
              </div>
              <small className="editor-help">💡 Haz clic derecho para insertar campos dinámicos | <strong>Enter</strong> = nuevo párrafo | <strong>Shift+Enter</strong> = salto de línea</small>
            </div>
          </div>

          <div className="form-actions">
            <Button variant="secondary" onClick={() => navigate("/configuracion/bloques")} icon={<X />}>Cancelar</Button>
            <Button type="submit" variant="primary" loading={guardando} disabled={guardando} icon={<Save />}>{esEdicion ? 'Actualizar Bloque' : 'Crear Bloque'}</Button>
          </div>
        </form>

        {menuContextual.visible && (
          <>
            <div className="context-menu-overlay" onClick={cerrarMenu} />
            <div className="context-menu" style={{ left: `${menuContextual.x}px`, top: `${menuContextual.y}px` }}>
              <div className="context-menu-header">Insertar Campo Dinámico</div>
              {camposDinamicos.map((campo, index) => (
                <button key={index} type="button" className="context-menu-item" onClick={() => insertarDesdeMenu(campo.name)}>
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
