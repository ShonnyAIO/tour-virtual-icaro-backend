'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('scenes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      panorama_url: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      initial_pitch: {
        type: Sequelize.DECIMAL,
        defaultValue: 0
      },
      initial_yaw: {
        type: Sequelize.DECIMAL,
        defaultValue: 0
      },
      initial_hfov: {
        type: Sequelize.DECIMAL,
        defaultValue: 100
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('scenes');
  }
};
