const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// Configuración de la base de datos
const config = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  dialectModule: require('pg'),
  logging: isProduction ? false : console.log,
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// Inicializar Sequelize con la configuración de la base de datos
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Importar modelos
const Scene = require('../models/Scene')(sequelize);
const Origen = require('../models/Origen')(sequelize);

// Establecer relaciones
Origen.hasMany(Scene, {
  foreignKey: 'origenId',
  as: 'escenas'
});

Scene.belongsTo(Origen, {
  foreignKey: 'origenId',
  as: 'origen'
});

// Objeto para almacenar los modelos
const db = {
  sequelize,
  Scene,
  Origen
};

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente.');
    return true;
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
    return false;
  }
};

// Sincronizar modelos (esto creará las tablas si no existen)
const syncModels = async () => {
  try {
    // En desarrollo, usamos alter para no perder datos
    // En producción, es mejor usar migraciones
    await sequelize.sync({ 
      force: false, 
      alter: !isProduction,
      logging: console.log 
    });
    
    console.log('✅ Modelos sincronizados correctamente.');
    return true;
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error);
    return false;
  }
};

// Ejecutar migraciones manualmente si es necesario
const runMigrations = async () => {
  try {
    // Importar las migraciones manualmente
    const createOrigenesTable = require('../migrations/20231012134600-create-origenes-table');
    const addOrigenIdToScenes = require('../migrations/20231012134700-add-origen-id-to-scenes');
    
    // Ejecutar migraciones en orden
    await createOrigenesTable.up(sequelize.getQueryInterface(), Sequelize);
    await addOrigenIdToScenes.up(sequelize.getQueryInterface(), Sequelize);
    
    console.log('✅ Migraciones ejecutadas correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al ejecutar migraciones:', error);
    return false;
  }
};

// Crear un origen por defecto si no existe
const createDefaultOrigen = async () => {
  try {
    const count = await db.Origen.count();
    if (count === 0) {
      await db.Origen.create({
        nombre: 'Origen por defecto',
        dominio: 'default',
        activo: true,
        configuracion: {}
      });
      console.log('✅ Origen por defecto creado');
    }
  } catch (error) {
    console.error('❌ Error al crear origen por defecto:', error);
  }
};

// Inicializar la base de datos
const initializeDatabase = async () => {
  await testConnection();
  await runMigrations();
  await syncModels();
  await createDefaultOrigen();
};

// Exportar todo
module.exports = {
  ...db,
  testConnection,
  syncModels,
  runMigrations,
  initializeDatabase,
  sequelize
};
