const Joi = require('joi');
const { Op } = require('sequelize');
const { Scene, Origen } = require('../config/database');

// Función para extraer el dominio de un origin
const extractDomain = (origin) => {
  if (!origin) return null;
  
  // Si el origin es una URL completa o comienza con http
  if (origin.startsWith('http')) {
    try {
      const url = new URL(origin);
      return url.hostname + (url.port ? `:${url.port}` : '');
    } catch (e) {
      // Si falla el parseo, intentamos extraer el dominio manualmente
      return origin.replace(/^https?:\/\//, '').split('/')[0].split('?')[0];
    }
  }
  
  // Si es solo el dominio (ej: localhost:3001)
  return origin.split('?')[0];
};

// Esquema de validación para una nueva escena
const sceneSchema = Joi.object({
  id: Joi.number().integer().optional(),
  id_scene: Joi.string().required(),
  title: Joi.string().required(),
  image: Joi.string().required(),
  pitch: Joi.number().required(),
  yaw: Joi.number().required(),
  hfov: Joi.number().default(200),
  origen: Joi.string().default('default'),
  hostSpots: Joi.object().pattern(
    Joi.string(), // key
    Joi.object({
      type: Joi.string().valid('custom').default('custom'),
      pitch: Joi.number().required(),
      yaw: Joi.number().required(),
      scene: Joi.string().required(),
      cssClass: Joi.string().default('moveScene')
    })
  ).default({})
});

/**
 * @description Obtiene todas las escenas con su estructura completa para un origen específico
 * @deprecated Usar GET /api/origenes/dominio/{dominio} en su lugar
 */
// Middleware para extraer y validar el dominio
const getDomainFromRequest = (req) => {
  // 1. Intentar obtener del header Origin
  if (req.get('Origin')) {
    return req.get('Origin').replace(/^https?:\/\//, '').split('/')[0];
  }
  
  // 2. Intentar del query parameter 'origen'
  if (req.query.origin) {
    return req.query.origin;
  }
  
  // 3. Intentar del host del header Host
  if (req.get('Host')) {
    return req.get('Host').split(':')[0]; // Eliminar el puerto si existe
  }
  
  // 4. Usar un valor por defecto
  return 'localhost';
};

exports.getScenesByOrigin = async (req, res, next) => {
  try {
    const domain = getDomainFromRequest(req);
    
    // Buscar el origen por dominio (case insensitive)
    const origen = await Origen.findOne({
      where: { 
        dominio: { 
          [Op.or]: [
            { [Op.eq]: domain },
            { [Op.eq]: `http://${domain}` },
            { [Op.eq]: `https://${domain}` }
          ]
        }
      },
      include: [{
        model: Scene,
        as: 'escenas',
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      }]
    });
    
    if (!origen) {
      return res.status(404).json({
        error: 'No se encontró un origen registrado para este dominio',
        domain,
        suggestion: 'Registra este dominio como un origen primero'
      });
    }
    
    // Si no hay escenas para este origen
    if (!origen.escenas || origen.escenas.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron escenas para este origen',
        domain,
        origenId: origen.id,
        suggestion: 'Asegúrate de haber creado escenas para este origen'
      });
    }
    
    // Convertir el array a un objeto usando el id como clave
    const scenesObject = {};
    origen.escenas.forEach(scene => {
      scenesObject[scene.id] = {
        id_scene: scene.id_scene,
        title: scene.title,
        image: scene.image,
        pitch: scene.pitch,
        yaw: scene.yaw,
        hfov: scene.hfov,
        hostSpots: scene.hostSpots || {}
      };
    });
    
    // Agregar metadatos de la respuesta
    const response = {
      success: true,
      domain: origen.dominio,
      origenId: origen.id,
      totalScenes: origen.escenas.length,
      configuracion: origen.configuracion,
      data: scenesObject
    };
    
    // Agregar un aviso de que este endpoint está obsoleto
    if (process.env.NODE_ENV !== 'production') {
      response.deprecationWarning = 'Este endpoint está obsoleto. Usa GET /api/origenes/dominio/{dominio} en su lugar';
    }
    
    res.status(200).json(response);
  } catch (error) {
  }
};

/**
 * @description Crea o actualiza una escena
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función de middleware
 */
exports.createOrUpdateScene = async (req, res, next) => {
  try {
    const { error, value } = sceneSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      throw error;
    }

    // Obtener el dominio del header Origin o del query parameter
    const origin = req.query.origin;
    if (!origin) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere el encabezado Origin o el parámetro origin',
        suggestion: 'Incluye el dominio de origen en el encabezado Origin o como parámetro de consulta',
        example: 'Origin: https://tu-dominio.com' 
      });
    }

    console.log('Origin:', origin);
    
    // Extraer solo el dominio
    const domain = extractDomain(origin);
    
    // Buscar el origen por dominio
    let origen = await Origen.findOne({ 
      where: { 
        [Op.or]: [
          { dominio: domain },
          { dominio: `http://${domain}` },
          { dominio: `https://${domain}` }
        ]
      }
    });
    
    if (!origen) {
      return res.status(400).json({
        success: false,
        error: 'El dominio especificado no está registrado',
        suggestion: 'Registra este dominio como un origen primero',
        domain: domain
      });
    }

    // Preparar los datos de la escena
    const sceneData = {
      ...value,
      id_scene: value.id_scene || value.id, // Usar id_scene si está presente, de lo contrario usar el id anterior
      origenId: origen.id,
      dominio: domain
    };
    
    const { id } = value;
    let scene, created;

    if (id) {
      // Actualización de escena existente
      [scene, created] = await Scene.upsert(
        { id, ...sceneData },
        { 
          returning: true,
          conflictFields: ['id']
        }
      );
    } else {
      // Creación de nueva escena
      scene = await Scene.create(sceneData);
      created = true;
    }

    // Obtener la escena con la información del origen
    const sceneWithOrigin = await Scene.findByPk(scene.id, {
      include: [{
        model: Origen,
        as: 'origen',
        attributes: ['id', 'nombre', 'dominio', 'activo']
      }]
    });

    res.status(created ? 201 : 200).json({
      success: true,
      message: created ? 'Escena creada exitosamente' : 'Escena actualizada exitosamente',
      data: sceneWithOrigin
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        error: 'Error de validación',
        details: error.details.map(d => d.message)
      });
    }
    next(error);
  }
};

/**
 * @description Obtiene una escena por su ID
 */
exports.getSceneById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const scene = await Scene.findByPk(id);
    
    if (!scene) {
      return res.status(404).json({ error: 'Escena no encontrada' });
    }
    
    res.status(200).json({
      [scene.id]: {
        id_scene: scene.id_scene,
        title: scene.title,
        image: scene.image,
        pitch: scene.pitch,
        yaw: scene.yaw,
        hfov: scene.hfov,
        hostSpots: scene.hostSpots || {}
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Elimina una escena por su ID
 */
exports.deleteScene = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Scene.destroy({
      where: { id }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Escena no encontrada' });
    }
    
    res.status(200).json({ message: 'Escena eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
};
