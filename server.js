import express from 'express';
import pool from './db.js';
import multer from 'multer';
import path from 'path';

const app = express();
app.use(express.json());

// Configuración de Multer para guardar archivos en /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + Date.now() + ext;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  // Solo aceptar imágenes y PDF
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos JPG, PNG o PDF'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });


// Endpoint para listar solicitudes
app.get('/api/requests', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer_request');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar solicitudes' });
  }
});

// Endpoint para obtener una solicitud por id
app.get('/api/requests/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const result = await pool.query('SELECT * FROM customer_request WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar la solicitud' });
  }
});


// Endpoint para crear una nueva solicitud con adjunto
app.post('/api/requests', upload.single('adjunto'), async (req, res) => {
  try {
    const {
      tenant_id,
      channel_id,
      status_id,
      customer_name,
      customer_identifier,
      tipo_identificacion,
      email,
      tipo_cliente,
      request_type,
      subject,
      country,
      departamento,
      ciudad,
      message,
      created_by
    } = req.body;

    // Insertar la solicitud
    const result = await pool.query(
      `INSERT INTO customer_request (
        tenant_id, channel_id, status_id, customer_name, customer_identifier,
        tipo_identificacion, email, tipo_cliente, request_type, subject,
        country, departamento, ciudad, message, created_by, created_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, NOW()
      ) RETURNING *`,
      [
        tenant_id, channel_id, status_id, customer_name, customer_identifier,
        tipo_identificacion, email, tipo_cliente, request_type, subject,
        country, departamento, ciudad, message, created_by
      ]
    );
    const solicitud = result.rows[0];

    // Si hay archivo adjunto, guardarlo en la tabla attachment
    if (req.file) {
      await pool.query(
        `INSERT INTO attachment (
          request_id, file_name, mime_type, file_size, storage_url, uploaded_at, uploaded_by
        ) VALUES (
          $1, $2, $3, $4, $5, NOW(), $6
        )`,
        [
          solicitud.id,
          req.file.filename,
          req.file.mimetype,
          req.file.size,
          req.file.path,
          created_by
        ]
      );
    }

    res.status(201).json(solicitud);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la solicitud' });
  }
});

// Puerto donde se ejecuta el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});