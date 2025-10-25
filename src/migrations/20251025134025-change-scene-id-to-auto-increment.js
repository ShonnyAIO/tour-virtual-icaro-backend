'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // 1. Add a new temporary column for the new ID
      await queryInterface.addColumn(
        'scenes',
        'new_id',
        {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        { transaction }
      );
      
      // 2. Copy data from old id to new_id
      await queryInterface.sequelize.query(
        "UPDATE scenes SET new_id = CAST(id AS INTEGER) WHERE id ~ '^\\d+$'"
      );
      
      // 3. Drop the old primary key constraint
      await queryInterface.removeConstraint('scenes', 'scenes_pkey', { transaction });
      
      // 4. Drop the old id column
      await queryInterface.removeColumn('scenes', 'id', { transaction });
      
      // 5. Rename new_id to id
      await queryInterface.renameColumn('scenes', 'new_id', 'id', { transaction });
      
      // 6. Recreate the primary key constraint
      await queryInterface.addConstraint('scenes', {
        fields: ['id'],
        type: 'primary key',
        name: 'scenes_pkey',
        transaction
      });
      
      // 7. Update the sequence to the max id + 1
      await queryInterface.sequelize.query(
        "SELECT setval('scenes_id_seq', (SELECT MAX(id) FROM scenes) + 1)",
        { transaction }
      );
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // 1. Add a new temporary column for the old ID type
      await queryInterface.addColumn(
        'scenes',
        'old_id',
        {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        { transaction }
      );
      
      // 2. Convert the numeric ID back to string
      await queryInterface.sequelize.query(
        'UPDATE scenes SET old_id = id::text',
        { transaction }
      );
      
      // 3. Drop the primary key constraint
      await queryInterface.removeConstraint('scenes', 'scenes_pkey', { transaction });
      
      // 4. Drop the id column
      await queryInterface.removeColumn('scenes', 'id', { transaction });
      
      // 5. Rename old_id to id
      await queryInterface.renameColumn('scenes', 'old_id', 'id', { transaction });
      
      // 6. Recreate the primary key constraint
      await queryInterface.addConstraint('scenes', {
        fields: ['id'],
        type: 'primary key',
        name: 'scenes_pkey',
        transaction
      });
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
