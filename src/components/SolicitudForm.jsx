import React, { useState } from 'react';
import './SolicitudForm.css';

const SolicitudForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    nombres: '',
    tipo_identificacion: '',
    identificacion: '',
    email: '',
    tipo_cliente: '',
    tipo_solicitud: '',
    pais: '',
    departamento: '',
    ciudad: '',
    solicitud: '',
    adjunto: null,
    tenant_id: 1,
    channel_id: 1,
    status_id: 1
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'adjunto') {
      setForm({ ...form, adjunto: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);

    // Validar campos obligatorios
    const requiredFields = [
      { key: 'nombres', label: 'Nombres y apellidos' },
      { key: 'tipo_identificacion', label: 'Tipo de identificación' },
      { key: 'identificacion', label: 'Identificación del cliente' },
      { key: 'email', label: 'Email' },
      { key: 'tipo_cliente', label: 'Tipo de cliente' },
      { key: 'tipo_solicitud', label: 'Tipo de solicitud' },
      { key: 'pais', label: 'Country' },
      { key: 'departamento', label: 'Departamento' },
      { key: 'ciudad', label: 'Ciudad' },
      { key: 'solicitud', label: 'Solicitud' },
      { key: 'tenant_id', label: 'Empresa (tenant_id)' },
      { key: 'channel_id', label: 'Canal (channel_id)' },
      { key: 'status_id', label: 'Estado (status_id)' }
    ];
    const missing = requiredFields.filter(f => !form[f.key] || (typeof form[f.key] === 'string' && form[f.key].trim() === ''));
    if (missing.length > 0) {
      alert(`Falta completar el campo: ${missing[0].label}`);
      return;
    }

    // Construir FormData para enviar archivo y datos
    const formData = new FormData();
    formData.append('customer_name', form.nombres);
    formData.append('tipo_identificacion', form.tipo_identificacion);
    formData.append('customer_identifier', form.identificacion);
    formData.append('email', form.email);
    formData.append('tipo_cliente', form.tipo_cliente);
    formData.append('request_type', form.tipo_solicitud);
    formData.append('country', form.pais);
    formData.append('departamento', form.departamento);
    formData.append('ciudad', form.ciudad);
    formData.append('message', form.solicitud);
    formData.append('subject', 'Solicitud desde formulario web');
  formData.append('tenant_id', form.tenant_id ? Number(form.tenant_id) : 1);
  formData.append('channel_id', form.channel_id ? Number(form.channel_id) : 1);
  formData.append('status_id', form.status_id ? Number(form.status_id) : 1);
    formData.append('created_by', 'webform');
    if (form.adjunto) {
      formData.append('adjunto', form.adjunto);
    }

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        alert('Solicitud enviada correctamente');
        setForm({
          nombres: '',
          tipo_identificacion: '',
          identificacion: '',
          email: '',
          tipo_cliente: '',
          tipo_solicitud: '',
          pais: '',
          departamento: '',
          ciudad: '',
          solicitud: '',
          adjunto: null,
          tenant_id: 1,
          channel_id: 1,
          status_id: 1
        });
      } else {
        const errorText = await response.text();
        alert('Error al enviar la solicitud: ' + errorText);
      }
    } catch (error) {
      alert('Error de conexión al backend: ' + error.message);
    }
  };

  return (
    <div className="solicitud-form-container">
      <div className="solicitud-form-header">
        <h1>📝 Nueva Solicitud</h1>
        <p>Complete el formulario para crear una nueva solicitud. Los campos marcados con * son obligatorios.</p>
      </div>

      <div className="solicitud-form-card">
        <form onSubmit={handleSubmit}>
          <div className="solicitud-form-grid">
            
            {/* Nombres y apellidos */}
            <div className="solicitud-form-field full-width">
              <label>Nombres y apellidos <span className="required">*</span></label>
              <input 
                name="nombres" 
                value={form.nombres} 
                onChange={handleChange} 
                placeholder="Ingrese nombres y apellidos completos"
                required 
              />
            </div>

            {/* Tipo de identificación */}
            <div className="solicitud-form-field">
              <label>Tipo de identificación <span className="required">*</span></label>
              <select name="tipo_identificacion" value={form.tipo_identificacion} onChange={handleChange} required>
                <option value="">Seleccione una opción</option>
                <option value="CC">Cédula de ciudadanía</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="NIT">NIT</option>
                <option value="PAS">Pasaporte</option>
              </select>
            </div>

            {/* Identificación del cliente */}
            <div className="solicitud-form-field">
              <label>Identificación del cliente <span className="required">*</span></label>
              <input 
                name="identificacion" 
                value={form.identificacion} 
                onChange={handleChange} 
                placeholder="Número de identificación"
                required 
              />
            </div>

            {/* Email */}
            <div className="solicitud-form-field">
              <label>Email <span className="required">*</span></label>
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="correo@ejemplo.com"
                required 
              />
            </div>

            {/* Tipo de cliente */}
            <div className="solicitud-form-field">
              <label>Tipo de cliente <span className="required">*</span></label>
              <select name="tipo_cliente" value={form.tipo_cliente} onChange={handleChange} required>
                <option value="">Seleccione una opción</option>
                <option value="natural">Persona Natural</option>
                <option value="juridica">Persona Jurídica</option>
              </select>
            </div>

            {/* Tipo de solicitud */}
            <div className="solicitud-form-field">
              <label>Tipo de solicitud <span className="required">*</span></label>
              <select name="tipo_solicitud" value={form.tipo_solicitud} onChange={handleChange} required>
                <option value="">Seleccione una opción</option>
                <option value="consulta">Consulta</option>
                <option value="reclamo">Reclamo</option>
                <option value="peticion">Petición</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* País */}
            <div className="solicitud-form-field">
              <label>País <span className="required">*</span></label>
              <select name="pais" value={form.pais} onChange={handleChange} required>
                <option value="">Seleccione una opción</option>
                <option value="Colombia">Colombia</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* Departamento */}
            <div className="solicitud-form-field">
              <label>Departamento <span className="required">*</span></label>
              <input 
                name="departamento" 
                value={form.departamento} 
                onChange={handleChange} 
                placeholder="Ej: Antioquia"
                required 
              />
            </div>

            {/* Ciudad */}
            <div className="solicitud-form-field">
              <label>Ciudad <span className="required">*</span></label>
              <input 
                name="ciudad" 
                value={form.ciudad} 
                onChange={handleChange} 
                placeholder="Ej: Medellín"
                required 
              />
            </div>

            {/* Solicitud - textarea full width */}
            <div className="solicitud-form-field full-width">
              <label>Escriba su solicitud <span className="required">*</span></label>
              <textarea 
                name="solicitud" 
                value={form.solicitud} 
                onChange={handleChange} 
                placeholder="Describa detalladamente su solicitud..."
                required 
              />
            </div>

            {/* Archivos adjuntos */}
            <div className="solicitud-form-field full-width">
              <label>Archivos adjuntos</label>
              <input 
                name="adjunto" 
                type="file" 
                accept=".jpg,.png,.pdf" 
                onChange={handleChange} 
              />
              {form.adjunto && (
                <div className="file-info">
                  <strong>Archivo seleccionado:</strong> {form.adjunto.name}
                </div>
              )}
            </div>
          </div>

          <div className="solicitud-form-actions">
            <button type="button" onClick={() => setForm({
              nombres: '',
              tipo_identificacion: '',
              identificacion: '',
              email: '',
              tipo_cliente: '',
              tipo_solicitud: '',
              pais: '',
              departamento: '',
              ciudad: '',
              solicitud: '',
              adjunto: null,
              tenant_id: 1,
              channel_id: 1,
              status_id: 1
            })}>
              Cancelar
            </button>
            <button type="submit">
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolicitudForm;
