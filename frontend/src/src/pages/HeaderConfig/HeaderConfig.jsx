import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs';
import { apiUrl } from '../../config/api';
import './HeaderConfig.css';

const LOCAL_STORAGE_KEY = 'blocket_header_config';

export default function HeaderConfig() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
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

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Cargar configuración al montar el componente
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoadingData(true);
      
      // Intentar cargar desde la API primero
      const response = await fetch(apiUrl('/api/header-config?tenant_id=1'));
      
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
        // Sincronizar con localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } else {
        // Si falla la API, intentar cargar desde localStorage
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
          setConfig(JSON.parse(localData));
        }
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      
      // En caso de error de red, usar localStorage como fallback
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData) {
        setConfig(JSON.parse(localData));
        setMessage('Modo offline: usando configuración local');
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setMessage('❌ Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage('❌ La imagen debe ser menor a 2MB');
      return;
    }

    setUploadingLogo(true);
    setMessage('⏳ Cargando logo...');

    try {
      // Convertir imagen a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setConfig(prev => ({
          ...prev,
          logo_url: base64String
        }));
        setUploadingLogo(false);
        setMessage('✅ Logo cargado exitosamente');
        setTimeout(() => setMessage(''), 3000);
      };
      reader.onerror = () => {
        setUploadingLogo(false);
        setMessage('❌ Error al cargar el logo');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error al cargar logo:', error);
      setUploadingLogo(false);
      setMessage('❌ Error al cargar el logo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Guardar primero en localStorage (sincronización local inmediata)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
      
      // Intentar guardar en la API
      const response = await fetch(apiUrl('/api/header-config'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...config,
          tenant_id: 1
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Configuración guardada exitosamente');
        // Actualizar con la respuesta del servidor
        setConfig(result.config);
      } else {
        setMessage('Guardado localmente (sin conexión al servidor)');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      setMessage('Guardado localmente (sin conexión al servidor)');
    } finally {
      setLoading(false);
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loadingData) {
    return (
      <div className="header-config-container">
        <div className="loading-state">Cargando configuración...</div>
      </div>
    );
  }

  // Datos de ejemplo para la simulación
  const mockHeader = {
    logo: config.logo_url,
    nombreEmpresa: config.company_name || 'Nombre de la Empresa',
    direccion: config.address,
    fecha: new Date(),
    destinatario: 'Juan Pérez García',
    identificacion: '1234567890',
    radicado: 'RAD-2024-001234',
    asunto: 'Respuesta a solicitud de información',
    saludo: config.greeting
  };

  return (
    <div className="header-config-container">
      <div className="header-config-header">
        <Breadcrumbs 
          items={[
            { label: "Configuración", path: "/configuracion" },
            { label: "Encabezado" }
          ]}
        />
        <h1>Configuración de Encabezado</h1>
        <p>Personaliza el encabezado que aparecerá en todos los documentos generados</p>
      </div>

      <div className="header-config-content">
        <form className="header-config-form" onSubmit={handleSubmit}>
        <div className="config-section">
          <h2>Información de la Empresa</h2>
          
          <div className="form-field">
            <label>Logo de la Empresa</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                />
                <small style={{color: '#64748b', fontSize: '12px', marginTop: '4px', display: 'block'}}>
                  Formatos: JPG, PNG, GIF | Máximo 2MB
                </small>
              </div>
              {config.logo_url && (
                <div style={{
                  width: '80px',
                  height: '80px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f8fafc'
                }}>
                  <img 
                    src={config.logo_url} 
                    alt="Logo preview" 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="form-field">
            <label>Nombre de la Empresa</label>
            <input
              type="text"
              name="company_name"
              value={config.company_name}
              onChange={handleChange}
              placeholder="EnerGAS S.A.S"
              required
            />
          </div>

          <div className="form-field">
            <label>Dirección</label>
            <input
              type="text"
              name="address"
              value={config.address}
              onChange={handleChange}
              placeholder="Av. Panamericana 45-21"
            />
          </div>

          <div className="form-field">
            <label>Ciudad</label>
            <input
              type="text"
              name="city"
              value={config.city}
              onChange={handleChange}
              placeholder="Santiago de Cali"
            />
          </div>

          <div className="form-field">
            <label>Saludo / Mensaje</label>
            <input
              type="text"
              name="greeting"
              value={config.greeting}
              onChange={handleChange}
              placeholder="Cordial saludo:"
            />
          </div>
        </div>

        <div className="config-section">
          <h2>Etiquetas de Campos</h2>
          <p className="section-description">Personaliza cómo se muestran los nombres de los campos</p>

          <div className="form-grid">
            <div className="form-field">
              <label>Etiqueta para Radicado</label>
              <input
                type="text"
                name="radicado_label"
                value={config.radicado_label}
                onChange={handleChange}
                placeholder="Radicado"
              />
            </div>

            <div className="form-field">
              <label>Etiqueta para Identificador</label>
              <input
                type="text"
                name="identificador_label"
                value={config.identificador_label}
                onChange={handleChange}
                placeholder="Identificador"
              />
            </div>

            <div className="form-field">
              <label>Etiqueta para Cargo/Representante</label>
              <input
                type="text"
                name="cargo_label"
                value={config.cargo_label}
                onChange={handleChange}
                placeholder="Cargo"
              />
              <small style={{color: '#64748b', fontSize: '12px', marginTop: '4px', display: 'block'}}>Ej: Cargo, Representante legal, Suscriptor, etc.</small>
            </div>
          </div>
        </div>

        <div className="config-section">
          <h2>Campos Visibles</h2>
          <p className="section-description">Selecciona qué campos se mostrarán en el encabezado</p>

          <div className="checkbox-grid">
            <label className="checkbox-field">
              <input
                type="checkbox"
                name="show_radicado"
                checked={config.show_radicado}
                onChange={handleChange}
              />
              <span>Mostrar Radicado</span>
            </label>

            <label className="checkbox-field">
              <input
                type="checkbox"
                name="show_identificador"
                checked={config.show_identificador}
                onChange={handleChange}
              />
              <span>Mostrar Identificador</span>
            </label>

            <label className="checkbox-field">
              <input
                type="checkbox"
                name="show_cargo"
                checked={config.show_cargo}
                onChange={handleChange}
              />
              <span>Mostrar Cargo/Representante</span>
            </label>
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/configuracion')}>
            Cancelar
          </button>
          <button type="submit" className="btn-save" disabled={loading}>
            <Save size={18} />
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </form>

      {/* Vista previa en tiempo real */}
      <div className="header-preview-section">
        <h2>Vista Previa</h2>
        <p className="preview-description">Así se verá el encabezado en tus documentos</p>
        
        <div className="preview-container">
          <div className="letter-header-preview">
            {/* Membrete superior de empresa */}
            <div className="letter-company">
              {config.logo_url && (
                <img src={config.logo_url} alt="Logo empresa" className="letter-logo" />
              )}
              <div>
                <h2 className="letter-company-name">{config.company_name || 'Nombre de la Empresa'}</h2>
                {config.address && (
                  <p className="letter-company-info">{config.address}</p>
                )}
              </div>
            </div>

            <hr className="letter-divider" />

            {/* Encabezado de la carta */}
            <div className="letter-meta">
              <p className="letter-date">
                {config.city || 'Ciudad'}, {new Date().toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <br />
              <p>Señor(a):</p>
              <p><strong>Juan Pérez García</strong></p>
              {config.show_cargo && (
                <p>{config.cargo_label}: Gerente General</p>
              )}
              {config.show_identificador && (
                <p>{config.identificador_label}: 1234567890</p>
              )}
              <p>Dirección: correo@correo.com.co</p>
              {config.show_radicado && (
                <p>{config.radicado_label}: RAD-2024-001234</p>
              )}
              <br />
              <p>Asunto: Respuesta a solicitud de información</p>
            </div>

            {/* Saludo */}
            <div className="letter-saludo">
              <p>{config.greeting || 'Cordial saludo'}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
