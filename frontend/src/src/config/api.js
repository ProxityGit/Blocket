// Configuración de la API
const API_URL = import.meta.env.VITE_API_URL || '';

export const apiUrl = (path) => {
  // Detección automática de entorno local
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // Si estamos en local, SIEMPRE usar ruta relativa para aprovechar el proxy de Vite (puerto 3000)
  // Si estamos en prod, usar la variable de entorno o path relativo si no existe
  if (isLocal) {
    return path;
  }

  return API_URL ? `${API_URL}${path}` : path;
};

export default { apiUrl };
