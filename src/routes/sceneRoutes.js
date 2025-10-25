const express = require('express');
const router = express.Router();
const sceneController = require('../controllers/sceneController');

/**
 * @swagger
 * /api/scenes/origin:
 *   get:
 *     summary: Obtiene las escenas filtradas por el dominio de origen
 *     tags: [Scenes]
 *     parameters:
 *       - in: header
 *         name: Origin
 *         schema:
 *           type: string
 *         example: https://ciencias.ucv.edu.ve
 *         description: Dominio de origen
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *         example: ciencias.ucv.edu.ve
 *         description: Dominio de origen (alternativa al header Origin)
 *     responses:
 *       200:
 *         description: Lista de escenas para el dominio especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 domain:
 *                   type: string
 *                 totalScenes:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     $ref: '#/components/schemas/Scene'
 *       404:
 *         description: No se encontraron escenas para el dominio especificado
 */
router.get('/origin', sceneController.getScenesByOrigin);

/**
 * @swagger
 * /api/scenes/{id}:
 *   get:
 *     summary: Obtiene una escena por su ID
 *     tags: [Scenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la escena
 *     responses:
 *       200:
 *         description: Escena encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Scene'
 *       404:
 *         description: Escena no encontrada
 */
router.get('/:id', sceneController.getSceneById);

/**
 * @swagger
 * /api/scenes:
 *   post:
 *     summary: Crea o actualiza una escena
 *     description: Crea una nueva escena o actualiza una existente. Si el dominio no existe, lo crea automáticamente.
 *     tags: [Scenes]
 *     parameters:
 *       - in: header
 *         name: Origin
 *         schema:
 *           type: string
 *         example: https://ciencias.ucv.edu.ve
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *         description: Alternativa al header Origin (solo para pruebas)
 *         example: ciencias.ucv.edu.ve
 *     requestBody:
 *       required: true
 *       description: Datos de la escena a crear o actualizar
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SceneInput'
 *           example:
 *             id: "sala-1"
 *             title: "Sala Principal"
 *             image: "panoramas/sala1.jpg"
 *             pitch: 0
 *             yaw: 0
 *             hfov: 100
 *             hostSpots:
 *               hs1:
 *                 pitch: -10
 *                 yaw: 0
 *                 scene: "sala-2"
 *                 cssClass: "custom-hotspot"
 *     responses:
 *       201:
 *         description: Escena creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Escena creada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Scene'
 *       200:
 *         description: Escena actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Escena actualizada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Scene'
 *       400:
 *         description: Error de validación o falta el dominio de origen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Se requiere el encabezado Origin o el parámetro origin"
 *                 suggestion:
 *                   type: string
 *                   example: "Incluye el dominio de origen en el encabezado Origin o como parámetro de consulta"
 *                 example:
 *                   type: string
 *                   example: "Origin: https://tu-dominio.com"
 */
router.post('/', sceneController.createOrUpdateScene);

/**
 * @swagger
 * /api/scenes/{id}:
 *   delete:
 *     summary: Elimina una escena por su ID
 *     tags: [Scenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la escena a eliminar
 *     responses:
 *       200:
 *         description: Escena eliminada exitosamente
 *       404:
 *         description: Escena no encontrada
 */
router.delete('/:id', sceneController.deleteScene);

/**
 * @swagger
 * components:
 *   schemas:
 *     SceneInput:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - image
 *         - pitch
 *         - yaw
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único de la escena
 *         title:
 *           type: string
 *           description: Título de la escena
 *         image:
 *           type: string
 *           description: URL de la imagen panorámica
 *         pitch:
 *           type: number
 *           description: Ángulo de inclinación inicial (en grados)
 *         yaw:
 *           type: number
 *           description: Ángulo de rotación inicial (en grados)
 *         hfov:
 *           type: number
 *           description: Campo de visión horizontal (en grados, por defecto 200)
 *         hostSpots:
 *           type: object
 *           additionalProperties:
 *             $ref: '#/components/schemas/HostSpot'
 *     HostSpot:
 *       type: object
 *       required:
 *         - type
 *         - pitch
 *         - yaw
 *         - scene
 *       properties:
 *         type:
 *           type: string
 *           enum: [custom]
 *           default: custom
 *         pitch:
 *           type: number
 *           description: Ángulo de inclinación del hotspot (en grados)
 *         yaw:
 *           type: number
 *           description: Ángulo de rotación del hotspot (en grados)
 *         scene:
 *           type: string
 *           description: ID de la escena de destino
 *         cssClass:
 *           type: string
 *           default: moveScene
 *           description: Clase CSS para el estilo del hotspot
 *     Scene:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         image:
 *           type: string
 *         pitch:
 *           type: number
 *         yaw:
 *           type: number
 *         hfov:
 *         hostSpots:
 *           type: object
 *           additionalProperties:
 *             $ref: '#/components/schemas/HostSpot'
 *     SceneResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         scene:
 *           type: object
 *           additionalProperties:
 *             $ref: '#/components/schemas/Scene'
 */

module.exports = router;
