import express from 'express';
import pool from './db.js';

const app = express();
app.use(express.json());


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

// Puerto donde se ejecuta el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});