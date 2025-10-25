'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('scenes', 'id_scene', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'id',
      comment: 'Identificador único de la escena'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('scenes', 'id_scene');
  }
};
