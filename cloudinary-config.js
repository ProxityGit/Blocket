import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Sube un archivo a Cloudinary
 * @param {string} filePath - Ruta local del archivo
 * @param {string} folder - Carpeta en Cloudinary (opcional)
 * @returns {Promise<object>} - Resultado con URL del archivo
 */
export async function uploadToCloudinary(filePath, folder = 'blocket/attachments') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto', // Detecta automáticamente el tipo (imagen, pdf, etc)
      use_filename: true,
      unique_filename: true
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    console.error('Error subiendo a Cloudinary:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Elimina un archivo de Cloudinary
 * @param {string} publicId - ID público del archivo en Cloudinary
 * @returns {Promise<object>}
 */
export async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      result
    };
  } catch (error) {
    console.error('Error eliminando de Cloudinary:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default cloudinary;
