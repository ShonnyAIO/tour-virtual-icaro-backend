const { sequelize } = require('../src/config/database');
const path = require('path');

async function runMigrations() {
  const queryInterface = sequelize.getQueryInterface();
  
  try {
    console.log('🔍 Verificando conexión a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Importar las migraciones manualmente
    console.log('🔄 Importando migraciones...');
    const createOrigenesTable = require('../src/migrations/20231012134600-create-origenes-table');
    const addOrigenIdToScenes = require('../src/migrations/20231012134700-add-origen-id-to-scenes');
    const addHostSpotsToScenes = require('../src/migrations/20231012140000-add-host-spots-to-scenes');
    
    // Ejecutar migraciones en orden
    console.log('🚀 Ejecutando migración: create-origenes-table');
    await createOrigenesTable.up(queryInterface, sequelize.Sequelize);
    
    console.log('🚀 Ejecutando migración: add-origen-id-to-scenes');
    await addOrigenIdToScenes.up(queryInterface, sequelize.Sequelize);
    
    console.log('🚀 Ejecutando migración: add-host-spots-to-scenes');
    await addHostSpotsToScenes.up(queryInterface, sequelize.Sequelize);
    
    console.log('✅ ¡Todas las migraciones se han ejecutado correctamente!');
    
    // Crear un origen por defecto
    console.log('🔄 Creando origen por defecto...');
    const Origen = require('../src/models/Origen')(sequelize);
    const [origen, created] = await Origen.findOrCreate({
      where: { dominio: 'default' },
      defaults: {
        nombre: 'Origen por defecto',
        activo: true,
        configuracion: {}
      }
    });
    
    if (created) {
      console.log('✅ Origen por defecto creado exitosamente');
    } else {
      console.log('ℹ️  El origen por defecto ya existe');
    }
    
    // Actualizar las escenas existentes para que tengan el origen por defecto
    console.log('🔄 Actualizando escenas existentes...');
    const Scene = require('../src/models/Scene')(sequelize);
    
    await Scene.update(
      { origenId: origen.id, dominio: 'default' },
      { where: { origenId: null } }
    );
    
    console.log('✅ Escenas actualizadas correctamente');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al ejecutar migraciones:', error);
    process.exit(1);
  }
}

// Ejecutar las migraciones
runMigrations().catch(error => {
  console.error('❌ Error inesperado:', error);
  process.exit(1);
});
