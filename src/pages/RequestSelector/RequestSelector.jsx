import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RequestSelector.css";
import AttachmentsDrawer from "../../components/AttachmentsDrawer";
import { FaPaperclip, FaSort } from "react-icons/fa";

export default function RequestSelector() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [sort, setSort] = useState('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [filterText, setFilterText] = useState("");

  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudesConAdjunto, setSolicitudesConAdjunto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAttachments, setDrawerAttachments] = useState([]);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 10; // Cantidad  items por página

  // Filtros y paginación deben declararse antes de su uso
  const filtradas = solicitudes.filter(
    (s) =>
      (filtroTipo === "Todos" || (s.request_type && s.request_type === filtroTipo)) &&
      (
        (s.customer_name && s.customer_name.toLowerCase().includes(search.toLowerCase())) ||
        (s.subject && s.subject.toLowerCase().includes(search.toLowerCase()))
      )
  );

  const filteredSolicitudes = filtradas.filter(s => {
    if (!filterText) return true;
    return (
      (s.customer_name && s.customer_name.toLowerCase().includes(filterText.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(filterText.toLowerCase())) ||
      (s.subject && s.subject.toLowerCase().includes(filterText.toLowerCase())) ||
      (s.ciudad && s.ciudad.toLowerCase().includes(filterText.toLowerCase())) ||
      (s.departamento && s.departamento.toLowerCase().includes(filterText.toLowerCase()))
    );
  });

  const totalPages = Math.ceil(filteredSolicitudes.length / pageSize);
  const paginatedSolicitudes = filteredSolicitudes.slice((page-1)*pageSize, page*pageSize);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/requests").then(res => {
        if (!res.ok) throw new Error("Error al obtener solicitudes");
        return res.json();
      }),
      fetch("/api/attachments/all-ids").then(res => {
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
      const res = await fetch(`/api/attachments/${requestId}`);
      if (!res.ok) throw new Error("Error al obtener adjuntos");
      const data = await res.json();
      setDrawerAttachments(data);
    } catch (err) {
      setDrawerError(err.message);
      setDrawerAttachments([]);
    }
    setDrawerLoading(false);
  };

  // ...existing code...
  const handleSort = (field) => {
    if (sort === field) {
      setSortAsc(!sortAsc);
    } else {
      setSort(field);
      setSortAsc(true);
    }
  };

  // ...existing code...

  return (
    <div className="requests-container-extended">
      {/* ===== Encabezado ===== */}
      <header className="requests-header-extended">
        <div className="header-left">
          <h1>📋 Solicitudes Registradas</h1>
        </div>
      </header>

      {/* Estado de carga y error */}
      {loading && <div style={{textAlign:'center',margin:'32px'}}>Cargando solicitudes...</div>}
      {error && <div style={{color:'red',textAlign:'center',margin:'32px'}}>Error: {error}</div>}
      
      {/* ===== Sección de Filtros Unificada ===== */}
      <div className="filter-bar unified">
        <input
          type="text"
          placeholder="🔍 Buscar por cliente o asunto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-input"
        />
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="filter-select"
        >
          <option value="Todos">Todos los tipos</option>
          <option value="Activación">Activación</option>
          <option value="Actualización de datos">Actualización de datos</option>
          <option value="Reclamación">Reclamación</option>
        </select>
        <input
          type="text"
          placeholder="🔎 Filtrar por email, ciudad, depto..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="filter-input"
        />
        <button className="btn-new">➕ Nueva solicitud</button>
      </div>

      <p style={{color:'#6b7280', fontSize:14, marginBottom:24, textAlign:'center'}}>
        Selecciona una solicitud para abrir el constructor de documentos y gestionar la información asociada.
      </p>

      {/* ===== Contenedor de Tabla ===== */}
      <div className="requests-table-container">
        {/* ===== Cabecera de tabla ===== */}
        <div className="requests-table-header modern">
          <span onClick={() => handleSort('id')}>ID <FaSort style={{fontSize:10}}/></span>
          <span onClick={() => handleSort('created_at')}>Fecha <FaSort style={{fontSize:10}}/></span>
          <span onClick={() => handleSort('customer_name')}>cliente <FaSort style={{fontSize:10}}/></span>
          <span onClick={() => handleSort('customer_identifier')}>Id cliente <FaSort style={{fontSize:10}}/></span>
          <span onClick={() => handleSort('email')}>Email <FaSort style={{fontSize:10}}/></span>
          <span onClick={() => handleSort('request_type')}>Tipo <FaSort style={{fontSize:10}}/></span>
          <span onClick={() => handleSort('status_id')}>Estado <FaSort style={{fontSize:10}}/></span>
          <span onClick={() => handleSort('subject')}>Asunto <FaSort style={{fontSize:10}}/></span>
          <span onClick={() => handleSort('ciudad')}>Ciudad <FaSort style={{fontSize:10}}/></span>
          <span onClick={() => handleSort('departamento')}>Depto <FaSort style={{fontSize:10}}/></span>
          <span>Adjuntos</span>
        </div>

        {/* ===== Listado ===== */}
        <div className="requests-list modern">
          {paginatedSolicitudes.sort((a, b) => {
          if (!sort) return 0;
          if (a[sort] < b[sort]) return sortAsc ? -1 : 1;
          if (a[sort] > b[sort]) return sortAsc ? 1 : -1;
          return 0;
        }).map((s) => (
          <div
            key={s.id}
            className="request-row modern"
            onClick={() => navigate(`/constructor/${s.id}`)}
            style={{ boxShadow: "0 2px 8px #0001", borderRadius: 8, background: "#fff", marginBottom: 2, padding: 6, display: "grid", gridTemplateColumns: "60px 120px 1fr 120px 180px 120px 120px 1fr 120px 120px 120px", alignItems: "center", gap: 0, cursor: "pointer" }}
          >
            <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.id}</span>
            <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</span>
            <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.customer_name || "—"}</span>
            <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.customer_identifier || "—"}</span>
            <span style={{fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.email || "—"}</span>
            <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.request_type || "—"}</span>
            <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.status_id || "—"}</span>
            <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.subject || "—"}</span>
            <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.ciudad || "—"}</span>
            <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.departamento || "—"}</span>
            <span style={{justifySelf:'end'}}>
              {solicitudesConAdjunto.includes(s.id) ? (
                <button 
                  className="btn-attach" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowAttachments(s.id);
                  }}
                >
                  <FaPaperclip style={{ marginRight: 6 }} /> Ver adjuntos
                </button>
              ) : (
                <span style={{ color: "#bbb", fontSize: 13 }}>—</span>
              )}
            </span>
          </div>
        ))}

  {filteredSolicitudes.length === 0 && (
          <div className="empty-state">
            <p>⚪ No hay solicitudes que coincidan con los filtros actuales.</p>
          </div>
        )}
      </div>

      {/* ===== Paginación ===== */}
      <div className="pagination-bar">
        <button disabled={page === 1} onClick={() => setPage(page-1)} style={{marginRight:8}}>Anterior</button>
        <span>Página {page} de {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page+1)} style={{marginLeft:8}}>Siguiente</button>
      </div>
      </div> {/* Cierre de requests-table-container */}

      <AttachmentsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        attachments={drawerAttachments}
      />
      {drawerLoading && drawerOpen && (
        <div style={{position:'fixed',right:370,top:40,background:'#fff',padding:8,borderRadius:4,boxShadow:'0 2px 8px #0002',zIndex:1100}}>Cargando adjuntos...</div>
      )}
      {drawerError && drawerOpen && (
        <div style={{position:'fixed',right:370,top:80,background:'#fff',padding:8,borderRadius:4,boxShadow:'0 2px 8px #0002',zIndex:1100,color:'red'}}>Error: {drawerError}</div>
      )}
    </div>
  );
}
