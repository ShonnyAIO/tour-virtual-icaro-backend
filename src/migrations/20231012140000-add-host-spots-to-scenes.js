'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verificar si la columna ya existe
    const tableInfo = await queryInterface.describeTable('scenes');
    
    if (!tableInfo.host_spots) {
      // Agregar la columna host_spots como JSONB
      await queryInterface.addColumn('scenes', 'host_spots', {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
      });

      console.log('✅ Columna host_spots agregada a la tabla scenes');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar la columna si es necesario hacer rollback
    await queryInterface.removeColumn('scenes', 'host_spots');
    console.log('❌ Columna host_spots eliminada de la tabla scenes');
  }
};
