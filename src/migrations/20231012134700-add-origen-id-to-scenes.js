'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Primero, verificar si la columna ya existe
    const tableInfo = await queryInterface.describeTable('scenes');
    
    if (!tableInfo.origenId) {
      // Agregar la columna origenId como no nula
      await queryInterface.addColumn('scenes', 'origenId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'origenes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      });

      // Agregar la columna dominio como caché
      await queryInterface.addColumn('scenes', 'dominio', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'default'
      });

      console.log('Columnas origenId y dominio agregadas a la tabla scenes');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar las columnas si es necesario hacer rollback
    await queryInterface.removeColumn('scenes', 'origenId');
    await queryInterface.removeColumn('scenes', 'dominio');
    console.log('Columnas origenId y dominio eliminadas de la tabla scenes');
  }
};
