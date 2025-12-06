import { useState, useEffect } from 'react';
import "./LetterHeader.css";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const LOCAL_STORAGE_KEY = 'blocket_header_config';

function LetterHeader({ header }) {
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

  // Cargar configuración al montar
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      console.log('[LetterHeader] Cargando configuración del encabezado...');
      
      // Intentar cargar desde localStorage primero (más rápido)
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData) {
        const parsedData = JSON.parse(localData);
        console.log('[LetterHeader] Configuración desde localStorage:', parsedData);
        setConfig(parsedData);
      }

      // Luego cargar desde la API y actualizar si hay cambios
      const response = await fetch(`${API_URL}/header-config?tenant_id=1`);
      if (response.ok) {
        const data = await response.json();
        console.log('[LetterHeader] Configuración desde API:', data);
        setConfig(data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } else {
        console.warn('[LetterHeader] No se pudo cargar desde API, status:', response.status);
      }
    } catch (error) {
      console.error('[LetterHeader] Error al cargar configuración del encabezado:', error);
      // Si falla, usa localStorage o valores por defecto
    }
  };

  // Formatear fecha si es tipo Date o string ISO
  let fechaFormateada = header.fecha;
  if (header.fecha) {
    try {
      const fechaObj = new Date(header.fecha);
      if (!isNaN(fechaObj)) {
        const city = config.city || 'Santiago de Cali';
        fechaFormateada = `${city}, ${fechaObj.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })}`;
      }
    } catch {}
  }

  console.log('[LetterHeader] Datos del header:', header);
  console.log('[LetterHeader] Configuración aplicada:', config);
  console.log('[LetterHeader] show_cargo:', config.show_cargo, 'cargo:', header.cargo);

  return (
    <div className="letter-header">
      {/* 🔹 Membrete superior de empresa */}
      <div className="letter-company">
        {(config.logo_url || header.logo) && (
          <img src={config.logo_url || header.logo} alt="Logo empresa" className="letter-logo" />
        )}
        <div>
          <h2 className="letter-company-name">{config.company_name || header.nombreEmpresa}</h2>
          {(config.address || header.direccion) && (
            <p className="letter-company-info">{config.address || header.direccion}</p>
          )}
        </div>
      </div>

      <hr className="letter-divider" />

      {/* 🔹 Encabezado de la carta */}
      <div className="letter-meta">
        <p className="letter-date">{fechaFormateada}</p><br />
        <p>Señor(a):</p>
        <p><strong>{header.destinatario}</strong></p>
        {config.show_cargo && header.cargo && (
          <p>{config.cargo_label}: {header.cargo}</p>
        )}
        {config.show_identificador && header.identificacion && (
          <p>{config.identificador_label}: {header.identificacion}</p>
        )}
        <p>Dirección: correo@correo.com.co</p>
        {config.show_radicado && header.radicado && (
          <p>{config.radicado_label}: {header.radicado}</p>
        )}
        <br />
        <p>Asunto: {header.asunto}</p>
      </div>

      {/* 🔹 Saludo */}
      <div className="letter-saludo">
        <p>{config.greeting || header.saludo}</p>
      </div>
    </div>
  );
}

export default LetterHeader;
