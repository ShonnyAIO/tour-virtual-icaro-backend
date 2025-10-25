const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { upload } = require('../services/s3Service');

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Sube una imagen panorámica al bucket
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               panorama: 
 *                 type: string
 *                 format: binary
 *                 description: El archivo de imagen panorámica a subir.
 *     responses:
 *       200:
 *         description: Archivo subido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Archivo subido exitosamente"
 *                 url:
 *                   type: string
 *                   format: uri
 *                   example: "https://bucket.com/path/to/unique-filename.jpg"
 *       400:
 *         description: No se proporcionó ningún archivo
 */
router.post('/', upload.single('panorama'), uploadController.uploadFile);

module.exports = router;
