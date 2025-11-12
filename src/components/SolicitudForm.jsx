import React, { useState } from 'react';

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
    formData.append('tenant_id', form.tenant_id);
    formData.append('channel_id', form.channel_id);
    formData.append('status_id', form.status_id);
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
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto' }}>
      
      <label>Nombres y apellidos *</label>
      <input name="nombres" value={form.nombres} onChange={handleChange} required />

      <label>Tipo de identificación</label>
      <select name="tipo_identificacion" value={form.tipo_identificacion} onChange={handleChange} required>
        <option value="">Buscar elementos</option>
        <option value="CC">Cédula de ciudadanía</option>
        <option value="CE">Cédula de extranjería</option>
        <option value="NIT">NIT</option>
        <option value="PAS">Pasaporte</option>
      </select>

      <label>Identificación del cliente *</label>
      <input name="identificacion" value={form.identificacion} onChange={handleChange} required />

      <label>Email *</label>
      <input name="email" type="email" value={form.email} onChange={handleChange} required />

      <label>Tipo de cliente *</label>
      <select name="tipo_cliente" value={form.tipo_cliente} onChange={handleChange} required>
        <option value="">Buscar elementos</option>
        <option value="natural">Persona Natural</option>
        <option value="juridica">Persona Jurídica</option>
      </select>

      <label>Tipo de solicitud *</label>
      <select name="tipo_solicitud" value={form.tipo_solicitud} onChange={handleChange} required>
        <option value="">Buscar elementos</option>
        <option value="consulta">Consulta</option>
        <option value="reclamo">Reclamo</option>
        <option value="peticion">Petición</option>
        <option value="otro">Otro</option>
      </select>

      <label>Country *</label>
      <select name="pais" value={form.pais} onChange={handleChange} required>
        <option value="">Buscar elementos</option>
        <option value="Colombia">Colombia</option>
        <option value="Otro">Otro</option>
      </select>

      <label>Departamento *</label>
      <input name="departamento" value={form.departamento} onChange={handleChange} required />

      <label>Ciudad *</label>
      <input name="ciudad" value={form.ciudad} onChange={handleChange} required />

      <label>Escriba su solicitud *</label>
      <textarea name="solicitud" value={form.solicitud} onChange={handleChange} required />

      <label>Archivos adjuntos (máx 5MB, JPG/PNG/PDF)</label>
      <input name="adjunto" type="file" accept=".jpg,.png,.pdf" onChange={handleChange} />
      {form.adjunto && <div>No hay nada adjunto.<br />{form.adjunto.name}</div>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
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
        })}>Cancelar</button>
        <button type="submit">Enviar</button>
      </div>
    </form>
  );
};

export default SolicitudForm;
