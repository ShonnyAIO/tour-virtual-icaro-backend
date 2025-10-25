'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verificar si la tabla ya existe
    const tableExists = await queryInterface.showAllTables()
      .then(tables => tables.includes('origenes'));
    
    if (!tableExists) {
      await queryInterface.createTable('origenes', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nombre: {
          type: Sequelize.STRING,
          allowNull: false
        },
        dominio: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        activo: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false
        },
        configuracion: {
          type: Sequelize.JSONB,
          defaultValue: {}
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true
        }
      });

      // Crear índice único para el dominio
      await queryInterface.addIndex('origenes', ['dominio'], {
        unique: true,
        name: 'origenes_dominio_unique'
      });

      console.log('Tabla origenes creada exitosamente');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar la tabla si es necesario hacer rollback
    await queryInterface.dropTable('origenes');
    console.log('Tabla origenes eliminada');
  }
};
