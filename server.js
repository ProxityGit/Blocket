import express from 'express';
import pool from './db.js';
import multer from 'multer';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(cors());
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

        // Convertir los campos bigint a número
        const tenantIdNum = Number(tenant_id);
        const channelIdNum = Number(channel_id);
        const statusIdNum = Number(status_id);
        if (
          isNaN(tenantIdNum) ||
          isNaN(channelIdNum) ||
          isNaN(statusIdNum)
        ) {
          return res.status(400).json({
            error: 'tenant_id, channel_id y status_id deben ser números válidos',
            values: { tenant_id, channel_id, status_id }
          });
        }
        // Log para depuración de valores recibidos
        console.log({
          tenant_id: tenantIdNum,
          channel_id: channelIdNum,
          status_id: statusIdNum,
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
        });
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
        tenantIdNum, channelIdNum, statusIdNum, customer_name, customer_identifier,
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
          1 // uploaded_by: valor numérico fijo
        ]
      );
    }

    res.status(201).json(solicitud);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la solicitud' });
  }
});

// Endpoint para listar solicitudes
app.get('/api/requests', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer_request');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar solicitudes' });
  }
});

// Endpoint para obtener los ids de solicitudes con adjuntos
app.get('/api/attachments/all-ids', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT request_id FROM attachment');
    const ids = result.rows.map(r => r.request_id);
    res.json(ids);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar ids de adjuntos' });
  }
});

// Servir archivos adjuntos de la carpeta uploads
app.use('/uploads', express.static('uploads'));

// Endpoint para obtener adjuntos de una solicitud
app.get('/api/attachments/:request_id', async (req, res) => {
  try {
    const requestId = Number(req.params.request_id);
    if (isNaN(requestId)) {
      return res.status(400).json({ error: 'request_id inválido' });
    }
    const result = await pool.query('SELECT * FROM attachment WHERE request_id = $1', [requestId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar adjuntos' });
  }
});

// ========== ENDPOINTS DE BLOQUES ==========

// Obtener todos los bloques activos con sus campos dinámicos
app.get('/api/blocks', async (req, res) => {
  try {
    const { tenant_id = 1, is_active = true } = req.query;
    
    // Obtener bloques
    const blocksQuery = `
      SELECT b.*, p.name as process_name, c.name as category_name
      FROM blocket b
      LEFT JOIN process p ON b.process_id = p.id
      LEFT JOIN category c ON b.category_id = c.id
      WHERE b.tenant_id = $1 AND b.is_active = $2
      ORDER BY b.sort_order, b.title
    `;
    const blocksResult = await pool.query(blocksQuery, [tenant_id, is_active]);
    
    // Obtener campos dinámicos de todos los bloques
    const fieldsQuery = `
      SELECT * FROM blocket_dynamic_field 
      WHERE blocket_id = ANY($1)
      ORDER BY blocket_id, sort_order
    `;
    const blockIds = blocksResult.rows.map(b => b.id);
    const fieldsResult = blockIds.length > 0 
      ? await pool.query(fieldsQuery, [blockIds])
      : { rows: [] };
    
    // Mapear campos a sus bloques
    const blocks = blocksResult.rows.map(block => {
      const campos = fieldsResult.rows
        .filter(f => f.blocket_id === block.id)
        .map(f => ({
          name: f.name,
          label: f.label,
          type: f.type,
          required: f.required,
          options: f.options_json
        }));
      
      return {
        id: block.id,
        titulo: block.title,
        proceso: block.process_name || 'Sin proceso',
        causal: block.category_name || 'Sin categoría',
        tipo: block.key,
        texto: block.template_html,
        version: block.version,
        campos
      };
    });
    
    res.json(blocks);
  } catch (err) {
    console.error('Error al obtener bloques:', err);
    res.status(500).json({ error: 'Error al obtener bloques' });
  }
});

// Obtener un bloque específico con sus campos
app.get('/api/blocks/:id', async (req, res) => {
  try {
    const blockId = Number(req.params.id);
    if (isNaN(blockId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    
    // Obtener bloque
    const blockQuery = `
      SELECT b.*, p.name as process_name, c.name as category_name
      FROM blocket b
      LEFT JOIN process p ON b.process_id = p.id
      LEFT JOIN category c ON b.category_id = c.id
      WHERE b.id = $1
    `;
    const blockResult = await pool.query(blockQuery, [blockId]);
    
    if (blockResult.rows.length === 0) {
      return res.status(404).json({ error: 'Bloque no encontrado' });
    }
    
    // Obtener campos dinámicos
    const fieldsQuery = `
      SELECT * FROM blocket_dynamic_field 
      WHERE blocket_id = $1
      ORDER BY sort_order
    `;
    const fieldsResult = await pool.query(fieldsQuery, [blockId]);
    
    const block = blockResult.rows[0];
    const campos = fieldsResult.rows.map(f => ({
      id: f.id,
      name: f.name,
      label: f.label,
      type: f.type,
      required: f.required,
      sortOrder: f.sort_order,
      options: f.options_json
    }));
    
    res.json({
      id: block.id,
      titulo: block.title,
      proceso: block.process_name || 'Sin proceso',
      causal: block.category_name || 'Sin categoría',
      tipo: block.key,
      texto: block.template_html,
      version: block.version,
      isActive: block.is_active,
      isPublished: block.is_published,
      campos
    });
  } catch (err) {
    console.error('Error al obtener bloque:', err);
    res.status(500).json({ error: 'Error al obtener bloque' });
  }
});

// Crear nuevo bloque
app.post('/api/blocks', async (req, res) => {
  const client = await pool.connect();
  try {
    const { title, key, template_html, is_active, is_published, process_id, category_id, campos } = req.body;
    
    await client.query('BEGIN');
    
    // Insertar bloque
    const blockQuery = `
      INSERT INTO blocket (tenant_id, process_id, category_id, key, title, template_html, version, is_active, is_published, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `;
    const blockResult = await client.query(blockQuery, [
      1, // tenant_id por defecto
      process_id || 1,
      category_id || 1,
      key,
      title,
      template_html,
      'v1',
      is_active !== undefined ? is_active : true,
      is_published !== undefined ? is_published : false,
      0 // sort_order
    ]);
    
    const blockId = blockResult.rows[0].id;
    
    // Insertar campos dinámicos
    if (campos && campos.length > 0) {
      for (let i = 0; i < campos.length; i++) {
        const campo = campos[i];
        const fieldQuery = `
          INSERT INTO blocket_dynamic_field (blocket_id, name, label, type, required, sort_order, options_json)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await client.query(fieldQuery, [
          blockId,
          campo.name,
          campo.label,
          campo.type || 'text',
          campo.required !== undefined ? campo.required : true,
          campo.sort_order || i + 1,
          campo.options || null
        ]);
      }
    }
    
    await client.query('COMMIT');
    res.status(201).json({ id: blockId, message: 'Bloque creado exitosamente' });
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al crear bloque:', err);
    res.status(500).json({ error: 'Error al crear bloque: ' + err.message });
  } finally {
    client.release();
  }
});

// Actualizar bloque existente
app.put('/api/blocks/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const blockId = Number(req.params.id);
    const { title, key, template_html, is_active, is_published, process_id, category_id, campos } = req.body;
    
    await client.query('BEGIN');
    
    // Actualizar bloque
    const blockQuery = `
      UPDATE blocket
      SET title = $1, key = $2, template_html = $3, is_active = $4, is_published = $5,
          process_id = $6, category_id = $7, updated_at = NOW()
      WHERE id = $8
    `;
    await client.query(blockQuery, [
      title,
      key,
      template_html,
      is_active,
      is_published,
      process_id || 1,
      category_id || 1,
      blockId
    ]);
    
    // Eliminar campos existentes
    await client.query('DELETE FROM blocket_dynamic_field WHERE blocket_id = $1', [blockId]);
    
    // Insertar nuevos campos
    if (campos && campos.length > 0) {
      for (let i = 0; i < campos.length; i++) {
        const campo = campos[i];
        const fieldQuery = `
          INSERT INTO blocket_dynamic_field (blocket_id, name, label, type, required, sort_order, options_json)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await client.query(fieldQuery, [
          blockId,
          campo.name,
          campo.label,
          campo.type || 'text',
          campo.required !== undefined ? campo.required : true,
          campo.sort_order || i + 1,
          campo.options || null
        ]);
      }
    }
    
    await client.query('COMMIT');
    res.json({ message: 'Bloque actualizado exitosamente' });
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar bloque:', err);
    res.status(500).json({ error: 'Error al actualizar bloque: ' + err.message });
  } finally {
    client.release();
  }
});

// Eliminar bloque
app.delete('/api/blocks/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const blockId = Number(req.params.id);
    
    await client.query('BEGIN');
    
    // Eliminar campos dinámicos
    await client.query('DELETE FROM blocket_dynamic_field WHERE blocket_id = $1', [blockId]);
    
    // Eliminar bloque
    await client.query('DELETE FROM blocket WHERE id = $1', [blockId]);
    
    await client.query('COMMIT');
    res.json({ message: 'Bloque eliminado exitosamente' });
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al eliminar bloque:', err);
    res.status(500).json({ error: 'Error al eliminar bloque: ' + err.message });
  } finally {
    client.release();
  }
});

// ==========================================
// ENDPOINTS DE PROCESOS
// ==========================================

// GET /api/processes - Obtener todos los procesos
app.get('/api/processes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM process ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener procesos:', err);
    res.status(500).json({ error: 'Error al obtener procesos: ' + err.message });
  }
});

// GET /api/processes/:id - Obtener un proceso por ID
app.get('/api/processes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM process WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proceso no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener proceso:', err);
    res.status(500).json({ error: 'Error al obtener proceso: ' + err.message });
  }
});

// POST /api/processes - Crear un nuevo proceso
app.post('/api/processes', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { name, is_active } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'El nombre del proceso es obligatorio' });
    }
    
    await client.query('BEGIN');
    
    const result = await client.query(
      `INSERT INTO process (name, is_active, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING *`,
      [name.trim(), is_active ?? true]
    );
    
    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al crear proceso:', err);
    res.status(500).json({ error: 'Error al crear proceso: ' + err.message });
  } finally {
    client.release();
  }
});

// PUT /api/processes/:id - Actualizar un proceso existente
app.put('/api/processes/:id', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const { name, is_active } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'El nombre del proceso es obligatorio' });
    }
    
    await client.query('BEGIN');
    
    const result = await client.query(
      `UPDATE process 
       SET name = $1, is_active = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [name.trim(), is_active ?? true, id]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Proceso no encontrado' });
    }
    
    await client.query('COMMIT');
    res.json(result.rows[0]);
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar proceso:', err);
    res.status(500).json({ error: 'Error al actualizar proceso: ' + err.message });
  } finally {
    client.release();
  }
});

// DELETE /api/processes/:id - Eliminar un proceso
app.delete('/api/processes/:id', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    
    await client.query('BEGIN');
    
    // Verificar si el proceso está siendo usado por algún bloque
    const blocksUsing = await client.query(
      'SELECT COUNT(*) as count FROM blocket WHERE process_id = $1',
      [id]
    );
    
    if (parseInt(blocksUsing.rows[0].count) > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'No se puede eliminar el proceso porque está siendo usado por bloques existentes' 
      });
    }
    
    const result = await client.query(
      'DELETE FROM process WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Proceso no encontrado' });
    }
    
    await client.query('COMMIT');
    res.json({ message: 'Proceso eliminado exitosamente', process: result.rows[0] });
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al eliminar proceso:', err);
    res.status(500).json({ error: 'Error al eliminar proceso: ' + err.message });
  } finally {
    client.release();
  }
});

// Puerto donde se ejecuta el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});