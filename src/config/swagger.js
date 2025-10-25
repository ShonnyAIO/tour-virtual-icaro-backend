const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Tour Virtual Ícaro API',
    version: '1.0.0',
    description: 'API RESTful para gestionar las escenas y hotspots del tour virtual Ícaro.',
    contact: {
      name: 'Shonny Torres',
      email: 'shonny.torres@ucv.ve',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: 'Servidor de Desarrollo',
    },
  ],
  components: {
    schemas: {
      Origen: {
        type: 'object',
        required: ['nombre', 'dominio'],
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
            description: 'ID único del origen',
            example: 1
          },
          nombre: {
            type: 'string',
            description: 'Nombre descriptivo del origen',
            example: 'Facultad de Ciencias'
          },
          dominio: {
            type: 'string',
            description: 'Dominio completo del origen',
            example: 'ciencias.ucv.edu.ve'
          },
          activo: {
            type: 'boolean',
            description: 'Indica si el origen está activo',
            default: true
          },
          configuracion: {
            type: 'object',
            description: 'Configuración adicional del origen',
            properties: {
              tema: {
                type: 'string',
                example: 'azul'
              },
              logo: {
                type: 'string',
                example: '/logos/ciencias.png'
              }
            }
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de última actualización'
          },
          escenas: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Scene'
            },
            description: 'Lista de escenas asociadas a este origen'
          }
        }
      },
      OrigenInput: {
        type: 'object',
        required: ['nombre', 'dominio'],
        properties: {
          nombre: {
            type: 'string',
            description: 'Nombre descriptivo del origen',
            example: 'Facultad de Ciencias',
            minLength: 3,
            maxLength: 100
          },
          dominio: {
            type: 'string',
            description: 'Dominio completo del origen',
            example: 'ciencias.ucv.edu.ve',
            format: 'hostname'
          },
          activo: {
            type: 'boolean',
            description: 'Indica si el origen está activo',
            default: true
          },
          configuracion: {
            type: 'object',
            description: 'Configuración adicional del origen',
            properties: {
              tema: {
                type: 'string',
                example: 'azul',
                description: 'Tema de colores para la interfaz'
              },
              logo: {
                type: 'string',
                example: '/logos/ciencias.png',
                description: 'Ruta al logo del origen'
              }
            },
            additionalProperties: true
          }
        }
      },
      Hotspot: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 101 },
          scene_id: { type: 'integer', example: 1 },
          type: { type: 'string', enum: ['info', 'custom'], example: 'info' },
          pitch: { type: 'number', format: 'float', example: -20.5 },
          yaw: { type: 'number', format: 'float', example: 90.1 },
          css_class: { type: 'string', example: 'infoSpot' },
          text_content: { type: 'string', example: 'Información relevante aquí.' },
          external_url: { type: 'string', nullable: true, example: 'https://google.com' },
          target_scene_slug: { type: 'string', nullable: true, example: 'biblioteca' },
        }
      },
      NewHotspot: {
        type: 'object',
        required: ['type', 'pitch', 'yaw'],
        properties: {
          type: { type: 'string', enum: ['info', 'custom'], example: 'custom' },
          pitch: { type: 'number', format: 'float', example: -5 },
          yaw: { type: 'number', format: 'float', example: 180 },
          css_class: { type: 'string', example: 'moveScene' },
          text_content: { type: 'string', nullable: true, example: 'Información.' },
          external_url: { type: 'string', nullable: true },
          target_scene_slug: { type: 'string', nullable: true, example: 'salon-principal' },
        }
      },
      Scene: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          slug: { type: 'string', example: 'nueva-sala-test' },
          title: { type: 'string', example: 'Nueva Sala de Pruebas' },
          panorama_url: { type: 'string', example: 'https://bucket.com/path/to/image.jpg' },
          initial_pitch: { type: 'number', format: 'float', example: -10 },
          initial_yaw: { type: 'number', format: 'float', example: 15 },
          hotspots: {
            type: 'array',
            items: { $ref: '#/components/schemas/Hotspot' }
          }
        }
      },
      NewScene: {
        type: 'object',
        required: ['slug', 'title', 'panorama_url'],
        properties: {
          slug: { type: 'string', example: 'nueva-sala-test' },
          title: { type: 'string', example: 'Nueva Sala de Pruebas' },
          panorama_url: { type: 'string', example: 'https://bucket.com/path/to/image.jpg' },
          initial_pitch: { type: 'number', format: 'float', example: -10 },
          initial_yaw: { type: 'number', format: 'float', example: 15 },
          hotspots: {
            type: 'array',
            items: { $ref: '#/components/schemas/NewHotspot' }
          }
        }
      },
      PannellumHotspot: {
        type: 'object',
        properties: {
          pitch: { type: 'number', format: 'float', example: -5 },
          yaw: { type: 'number', format: 'float', example: 180 },
          type: { type: 'string', example: 'custom' },
          cssClass: { type: 'string', example: 'moveScene' },
          // For 'custom' type
          scene: { type: 'string', example: 'biblioteca' },
          // For 'info' type
          text: { type: 'string', example: 'Información relevante.' },
        }
      },
      PannellumScene: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Salón Principal' },
          image: { type: 'string', example: 'https://bucket.com/path/to/image.jpg' },
          pitch: { type: 'number', format: 'float', example: 0 },
          yaw: { type: 'number', format: 'float', example: 0 },
          hfov: { type: 'number', format: 'float', example: 100 },
          hotSpots: {
            type: 'object',
            additionalProperties: { $ref: '#/components/schemas/PannellumHotspot' },
            example: {
              "custom-1": { type: 'custom', pitch: -5, yaw: 180, scene: 'biblioteca', cssClass: 'moveScene' },
              "info-2": { type: 'info', pitch: -20, yaw: 90, text: 'Información relevante.', cssClass: 'infoSpot' },
            }
          }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  // Rutas a los archivos que contienen definiciones de la API
  apis: [
    './src/routes/*.js',
    './src/routes/**/*.js'  // Incluye todos los archivos en subdirectorios
  ],
  // Habilita la validación estricta de la documentación
  failOnErrors: true
};

// Generar la especificación de Swagger
const swaggerSpec = swaggerJSDoc(options);

// Validar que la especificación se generó correctamente
if (!swaggerSpec) {
  console.error('Error al generar la especificación de Swagger');
  process.exit(1);
}

module.exports = swaggerSpec;
