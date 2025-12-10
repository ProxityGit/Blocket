// Festivos Colombia 2025 y 2026 (Proyectados)
// Formato: YYYY-MM-DD
const HOLIDAYS_CO = [
    // 2025
    '2025-01-01', '2025-01-06', '2025-03-24', '2025-04-17', '2025-04-18',
    '2025-05-01', '2025-06-02', '2025-06-23', '2025-06-30', '2025-07-20',
    '2025-08-07', '2025-08-18', '2025-10-13', '2025-11-03', '2025-11-17',
    '2025-12-08', '2025-12-25',
    // 2026 (Estimados principales)
    '2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03',
    '2026-05-01', '2026-05-18', '2026-06-08', '2026-06-15', '2026-06-29',
    '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02',
    '2026-11-16', '2026-12-08', '2026-12-25'
];

/**
 * Calcula los días hábiles entre dos fechas (inclusive inicio, exclusivo fin para conteo de transcurso).
 * Se asume lunes a viernes como hábiles, excluyendo festivos.
 * @param {string|Date} startDate Fecha inicial
 * @param {string|Date} endDate Fecha final (generalmente hoy)
 * @returns {number} Número de días hábiles
 */
export const calculateBusinessDays = (startDate, endDate = new Date()) => {
    let start = new Date(startDate);
    let end = new Date(endDate);

    // Resetear horas para comparar solo fechas
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (start > end) return 0;

    let count = 0;
    let curDate = new Date(start);

    while (curDate <= end) {
        const dayOfWeek = curDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0=Domingo, 6=Sábado

        // Formato YYYY-MM-DD para buscar en array
        const dateStr = curDate.toISOString().split('T')[0];
        const isHoliday = HOLIDAYS_CO.includes(dateStr);

        if (!isWeekend && !isHoliday) {
            count++;
        }

        curDate.setDate(curDate.getDate() + 1);
    }

    // Restamos 1 porque el cálculo de "transcurridos" suele contar intervalos, 
    // pero si queremos contar "días de trabajo efectivos incluyendo hoy", se deja así.
    // El requerimiento dice "días hábiles transcurridos hasta el día de hoy". 
    // Si la solicitud llegó HOY, ¿son 0 o 1? Usualmente 0 transcurridos si es misma fecha.
    // Ajuste: si start === end, retornar 0.
    if (start.getTime() === end.getTime()) return 0;

    return count - 1; // Ajuste para contar "transcurridos" (diferencia), no días totales del rango.
};
