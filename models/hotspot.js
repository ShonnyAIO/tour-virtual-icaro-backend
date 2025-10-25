const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Hotspot extends Model {
    static associate(models) {
      // A Hotspot belongs to a Scene
      this.belongsTo(models.Scene, {
        foreignKey: 'scene_id',
        as: 'scene',
      });
    }
  }

  Hotspot.init({
    scene_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'scenes',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    pitch: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    yaw: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    css_class: {
      type: DataTypes.STRING,
    },
    text_content: {
      type: DataTypes.TEXT,
    },
    external_url: {
      type: DataTypes.TEXT,
    },
    target_scene_slug: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Hotspot',
    tableName: 'hotspots',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Hotspot;
};