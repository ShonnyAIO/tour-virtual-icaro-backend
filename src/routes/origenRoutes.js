const express = require('express');
const router = express.Router();
const origenController = require('../controllers/origenController');

/**
 * @swagger
 * tags:
 *   name: Origenes
 *   description: Gestión de orígenes de salas virtuales
 */

/**
 * @swagger
 * /api/origenes:
 *   post:
 *     summary: Crea un nuevo origen
 *     description: Registra un nuevo dominio que podrá tener sus propias escenas personalizadas
 *     tags: [Origenes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrigenInput'
 *           example:
 *             nombre: "Facultad de Ciencias"
 *             dominio: "ciencias.ucv.edu.ve"
 *             activo: true
 *             configuracion:
 *               tema: "azul"
 *               logo: "/logos/ciencias.png"
 *     responses:
 *       201:
 *         description: Origen creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Origen'
 *             example:
 *               id: 1
 *               nombre: "Facultad de Ciencias"
 *               dominio: "ciencias.ucv.edu.ve"
 *               activo: true
 *               configuracion:
 *                 tema: "azul"
 *                 logo: "/logos/ciencias.png"
 *               updatedAt: "2023-10-12T13:45:30.123Z"
 *               createdAt: "2023-10-12T13:45:30.123Z"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             example:
 *               error: "Error de validación"
 *               details:
 *                 - "El campo 'nombre' es requerido"
 *                 - "El campo 'dominio' debe ser un dominio válido"
 *       409:
 *         description: Conflicto - El dominio ya existe
 *         content:
 *           application/json:
 *             example:
 *               error: "El dominio ya está registrado"
 *               dominio: "ciencias.ucv.edu.ve"
 *               suggestion: "Utiliza un dominio diferente o actualiza el existente"
 */
router.post('/', origenController.createOrigen);

/**
 * @swagger
 * /api/origenes:
 *   get:
 *     summary: Obtiene todos los orígenes
 *     tags: [Origenes]
 *     responses:
 *       200:
 *         description: Lista de orígenes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Origen'
 */
router.get('/', origenController.getAllOrigenes);

/**
 * @swagger
 * /api/origenes/dominio/{dominio}:
 *   get:
 *     summary: Obtiene un origen por su dominio con todas sus escenas
 *     tags: [Origenes]
 *     parameters:
 *       - in: query
 *         name: dominio
 *         schema:
 *           type: string
 *           example: ciencias.ucv.edu.ve
 *         description: Dominio del origen
 *     responses:
 *       200:
 *         description: Origen encontrado con sus escenas
 *         content:
 *           application/json:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 dominio:
 *                   type: string
 *                 totalScenes:
 *                   type: integer
 *                 configuracion:
 *                   type: object
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     $ref: '#/components/schemas/Scene'
 */
router.get('/dominio/:dominio', origenController.getOrigenByDominio);

module.exports = router;
