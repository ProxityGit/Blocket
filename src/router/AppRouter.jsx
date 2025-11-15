//app-router: AppRouter.jsx
//descripción: Configuración de rutas principales de la aplicación.

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomeModules from "../pages/HomeModules/HomeModules.jsx";
import RequestSelector from "../pages/RequestSelector/RequestSelector.jsx";
import DocumentBuilder from "../pages/DocumentBuilder/DocumentBuilder.jsx";
import CrearSolicitud from "../pages/HomeModules/CrearSolicitud.jsx";
import ConfigLayout from "../layouts/ConfigLayout.jsx";
import Configuration from "../pages/Configuration/Configuration.jsx";
import BlockConfig from "../pages/BlockConfig/BlockConfig.jsx";
import BlockForm from "../pages/BlockConfig/BlockForm.jsx";
import ProcessConfig from "../pages/ProcessConfig/ProcessConfig.jsx";
import ProcessForm from "../pages/ProcessConfig/ProcessForm.jsx";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeModules />} />
        <Route path="/crear-solicitud" element={<CrearSolicitud />} />
        <Route path="/registro" element={<div>Registro de Solicitud (pendiente)</div>} />
        <Route path="/asignacion" element={<div>Asignación de bloques (pendiente)</div>} />
        <Route path="/constructor/:idSolicitud" element={<DocumentBuilder />} />
        <Route path="/consulta" element={<RequestSelector />} />
        
        {/* Configuración con Sidebar */}
        <Route path="/configuracion" element={<ConfigLayout />}>
          <Route index element={<Configuration />} />
          <Route path="usuarios" element={<div style={{padding: '20px'}}>Usuarios (pendiente)</div>} />
          <Route path="procesos" element={<ProcessConfig />} />
          <Route path="procesos/nuevo" element={<ProcessForm />} />
          <Route path="procesos/:id" element={<ProcessForm />} />
          <Route path="categorias" element={<div style={{padding: '20px'}}>Categorías (pendiente)</div>} />
          <Route path="bandejas" element={<div style={{padding: '20px'}}>Bandejas (pendiente)</div>} />
          <Route path="tipos-solicitud" element={<div style={{padding: '20px'}}>Tipos de Solicitud (pendiente)</div>} />
        </Route>
        
        {/* Bloques de Texto con Sidebar */}
        <Route path="/config/bloques" element={<ConfigLayout />}>
          <Route index element={<BlockConfig />} />
          <Route path="nuevo" element={<BlockForm />} />
          <Route path=":id" element={<BlockForm />} />
        </Route>
        
        <Route path="/parametrizacion" element={<div>Parametrización (pendiente)</div>} />
        <Route path="/metricas" element={<div>Métricas (pendiente)</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
