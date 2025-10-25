const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Scene extends Model {
    static associate(models) {
      // A Scene can have many Hotspots
      this.hasMany(models.Hotspot, {
        foreignKey: 'scene_id',
        as: 'hotspots',
      });
    }
  }

  Scene.init({
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    panorama_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    initial_pitch: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
    },
    initial_yaw: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
    },
    initial_hfov: {
      type: DataTypes.DECIMAL,
      defaultValue: 100,
    },
  }, {
    sequelize,
    modelName: 'Scene',
    tableName: 'scenes',
    timestamps: true, // Sequelize will manage createdAt and updatedAt
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Scene;
};