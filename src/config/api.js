// Configuración de la API
const API_URL = import.meta.env.VITE_API_URL || '';

export const apiUrl = (path) => {
  // Si VITE_API_URL está definido (producción), usar URL completa
  // Si no (desarrollo), usar ruta relativa que será proxeada por Vite
  return API_URL ? `${API_URL}${path}` : path;
};

export default { apiUrl };
