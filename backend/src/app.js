require('dotenv').config();

const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health.routes');
const courseRoutes = require('./routes/courses.routes');
const purchaseRoutes = require('./routes/purchases.routes');
const contactRoutes = require('./routes/contact.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'Backend de Lumina System funcionando correctamente.',
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/cursos', courseRoutes);
app.use('/api/compras', purchaseRoutes);
app.use('/api/contacto', contactRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;