const Joi = require('joi');
const { Origen, Scene } = require('../config/database');

// Esquema de validación para un origen
const origenSchema = Joi.object({
  nombre: Joi.string().required(),
  dominio: Joi.string().required(),
  activo: Joi.boolean().default(true),
  configuracion: Joi.object().default({})
});

/**
 * @description Crea un nuevo origen
 */
exports.createOrigen = async (req, res, next) => {
  try {
    const { error, value } = origenSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      throw error;
    }

    // Verificar si ya existe un origen con el mismo dominio
    const existeOrigen = await Origen.findOne({
      where: { dominio: value.dominio }
    });

    if (existeOrigen) {
      return res.status(400).json({
        error: 'Ya existe un origen con este dominio',
        dominio: value.dominio
      });
    }

    const origen = await Origen.create(value);
    
    res.status(201).json({
      message: 'Origen creado exitosamente',
      data: origen
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Obtiene todos los orígenes
 */
exports.getAllOrigenes = async (req, res, next) => {
  try {
    const origenes = await Origen.findAll({
      include: [{
        model: Scene,
        as: 'escenas',
        attributes: ['id', 'title']
      }],
      order: [['nombre', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: origenes.length,
      data: origenes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Obtiene un origen por su dominio
 */
exports.getOrigenByDominio = async (req, res, next) => {
  try {
    const { dominio } = req.params;
    
    const origen = await Origen.findOne({
      where: { dominio },
      include: [{
        model: Scene,
        as: 'escenas',
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      }]
    });

    if (!origen) {
      return res.status(404).json({
        error: 'Origen no encontrado',
        dominio,
        suggestion: 'Verifica el dominio o crea un nuevo origen'
      });
    }

    // Formatear la respuesta para mantener compatibilidad
    const escenas = {};
    origen.escenas.forEach(escena => {
      escenas[escena.id] = {
        title: escena.title,
        image: escena.image,
        pitch: escena.pitch,
        yaw: escena.yaw,
        hfov: escena.hfov,
        hostSpots: escena.hostSpots || {}
      };
    });

    res.status(200).json({
      success: true,
      dominio: origen.dominio,
      totalScenes: origen.escenas.length,
      configuracion: origen.configuracion,
      data: escenas
    });
  } catch (error) {
    next(error);
  }
};
