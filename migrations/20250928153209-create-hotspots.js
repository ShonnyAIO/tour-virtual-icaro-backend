'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hotspots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      scene_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'scenes', // name of the target table
          key: 'id',      // key in the target table that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      pitch: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      yaw: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      css_class: {
        type: Sequelize.STRING
      },
      text_content: {
        type: Sequelize.TEXT
      },
      external_url: {
        type: Sequelize.TEXT
      },
      target_scene_slug: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('hotspots');
  }
};
