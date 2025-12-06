import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Exporta el contenido HTML a PDF con alta calidad usando html2canvas
 * Configuración optimizada para evitar pérdida de texto
 */
export const exportPDF = async (elementRef, fileName = "documento") => {
  if (!elementRef.current) {
    console.error('[PDF] No se encontró el elemento para exportar');
    return;
  }

  const el = elementRef.current;
  
  // Activar modo impresión
  el.classList.add("print-mode");
  
  // Esperar más tiempo para que se rendericen todos los elementos
  await new Promise((r) => setTimeout(r, 300));

  try {
    console.log('[PDF] Generando canvas con configuración optimizada...');
    
    // Capturar con configuración óptima para texto
    const canvas = await html2canvas(el, {
      scale: 3, // Reducir a 3 pero con mejor configuración
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: false,
      logging: false,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
      // Configuración crítica para evitar pérdida de texto
      imageTimeout: 15000, // Más tiempo para cargar imágenes
      removeContainer: false, // No remover el contenedor
      letterRendering: true,
      foreignObjectRendering: false, // Desactivar para mejor compatibilidad
      scrollY: -window.scrollY,
      scrollX: -window.scrollX,
      width: el.scrollWidth,
      height: el.scrollHeight,
    });

    console.log('[PDF] Canvas generado:', canvas.width, 'x', canvas.height);

    // Convertir a imagen PNG con calidad máxima
    const imgData = canvas.toDataURL("image/png", 1.0);
    
    // Crear PDF en formato A4
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
      precision: 16,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    const margin = 0;
    const effectiveWidth = pageWidth - (margin * 2);
    
    // Calcular dimensiones
    const imgWidth = effectiveWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;
    let pageNumber = 1;

    console.log('[PDF] Agregando páginas...');

    // Primera página
    pdf.addImage(
      imgData, 
      "PNG", 
      margin, 
      position, 
      imgWidth, 
      imgHeight,
      undefined,
      "SLOW" // Cambiar a SLOW para mejor calidad
    );
    
    heightLeft -= pageHeight;

    // Páginas adicionales
    while (heightLeft > 0) {
      pdf.addPage();
      pageNumber++;
      position = -(imgHeight - heightLeft) + margin;
      
      pdf.addImage(
        imgData, 
        "PNG", 
        margin, 
        position, 
        imgWidth, 
        imgHeight,
        undefined,
        "SLOW"
      );
      
      heightLeft -= pageHeight;
    }

    console.log(`[PDF] Documento generado: ${pageNumber} página(s)`);

    // Metadatos
    pdf.setProperties({
      title: fileName,
      subject: 'Documento generado desde Blocket',
      author: 'Sistema Blocket',
      keywords: 'documento, generado',
      creator: 'Blocket Document Builder'
    });

    // Nombre de archivo con fecha
    const timestamp = new Date().toISOString().slice(0, 10);
    const finalFileName = `${fileName}_${timestamp}.pdf`;

    pdf.save(finalFileName);
    
    console.log(`[PDF] ✅ PDF guardado exitosamente: ${finalFileName}`);
    
    return {
      success: true,
      fileName: finalFileName,
      pages: pageNumber
    };

  } catch (error) {
    console.error('[PDF] ❌ Error al generar PDF:', error);
    throw error;
  } finally {
    el.classList.remove("print-mode");
  }
};
