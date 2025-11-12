//app-router: AppRouter.jsx
//descripción: Configuración de rutas principales de la aplicación.

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomeModules from "../pages/HomeModules/HomeModules.jsx";
import RequestSelector from "../pages/RequestSelector/RequestSelector.jsx";
import DocumentBuilder from "../pages/DocumentBuilder/DocumentBuilder.jsx";
import CrearSolicitud from "../pages/HomeModules/CrearSolicitud.jsx";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeModules />} />
          <Route path="/crear-solicitud" element={<CrearSolicitud />} />
        <Route path="/registro" element={<div>Registro de Solicitud (pendiente)</div>} />
        <Route path="/asignacion" element={<div>Asignación de bloques (pendiente)</div>} />
        <Route path="/constructor/:idSolicitud" element={<DocumentBuilder />} />
        <Route path="/consulta" element={<RequestSelector />} /> {/* ✅ Aquí entra el listado */}
        <Route path="/parametrizacion" element={<div>Parametrización (pendiente)</div>} />
        <Route path="/metricas" element={<div>Métricas (pendiente)</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
