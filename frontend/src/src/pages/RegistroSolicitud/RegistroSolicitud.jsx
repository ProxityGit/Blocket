import { useState } from "react";
import "./RegistroSolicitud.css";

export default function RegistroSolicitud() {
  const [form, setForm] = useState({
    customer_name: "",
    customer_identifier: "",
    request_type: "",
    subject: "",
    message: ""
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    // Aquí se haría el POST al backend
    // Por ahora solo simula éxito
    setSuccess(true);
    setForm({
      customer_name: "",
      customer_identifier: "",
      request_type: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="registro-container">
      <h2>Registro de Solicitud</h2>
      <form className="registro-form" onSubmit={handleSubmit}>
        <label>
          Nombre del cliente
          <input name="customer_name" value={form.customer_name} onChange={handleChange} required />
        </label>
        <label>
          Identificación
          <input name="customer_identifier" value={form.customer_identifier} onChange={handleChange} required />
        </label>
        <label>
          Tipo de solicitud
          <select name="request_type" value={form.request_type} onChange={handleChange} required>
            <option value="">Seleccione...</option>
            <option value="Queja">Queja</option>
            <option value="Reclamo">Reclamo</option>
            <option value="Solicitud">Solicitud</option>
            <option value="Otro">Otro</option>
          </select>
        </label>
        <label>
          Asunto
          <input name="subject" value={form.subject} onChange={handleChange} required />
        </label>
        <label>
          Mensaje
          <textarea name="message" value={form.message} onChange={handleChange} required />
        </label>
        <button type="submit">Registrar solicitud</button>
      </form>
      {success && <div className="registro-success">¡Solicitud registrada correctamente!</div>}
      {error && <div className="registro-error">{error}</div>}
    </div>
  );
}
