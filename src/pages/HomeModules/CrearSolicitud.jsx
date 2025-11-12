import React from "react";
import SolicitudForm from "../../components/SolicitudForm";
import "./CrearSolicitud.css";

const CrearSolicitud = () => {
  return (
    <div className="crear-solicitud-container">
      <div className="form-card">
        <h2>Crear solicitud de atención</h2>
        <p>
          Por favor, ingresa tus datos y describe tu solicitud. Te responderemos lo antes posible.
        </p>
        <SolicitudForm />
      </div>
    </div>
  );
};

export default CrearSolicitud;
