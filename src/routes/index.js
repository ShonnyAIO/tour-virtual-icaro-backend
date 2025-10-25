const express = require('express');
const router = express.Router();

const sceneRoutes = require('./sceneRoutes');
const uploadRoutes = require('./uploadRoutes');
const origenRoutes = require('./origenRoutes');

// Rutas principales
router.use('/scenes', sceneRoutes);
router.use('/upload', uploadRoutes);
router.use('/origenes', origenRoutes);

// Ruta de bienvenida
router.get('/', (req, res) => {
  res.json({
    message: 'API de Tour Virtual',
    endpoints: [
      { path: '/scenes', description: 'Gestión de escenas' },
      { path: '/origenes', description: 'Gestión de orígenes' },
      { path: '/upload', description: 'Carga de archivos' },
      { path: '/api-docs', description: 'Documentación de la API' }
    ]
  });
});

module.exports = router;