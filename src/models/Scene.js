const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Scene = sequelize.define('Scene', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'id'
    },
    id_scene: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'id_scene',
      comment: 'Identificador único de la escena'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'title'
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'image'
    },
    pitch: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'pitch'
    },
    yaw: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'yaw'
    },
    hfov: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      field: 'hfov'
    },
    hostSpots: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      field: 'host_spots'  // Especificar el nombre real de la columna en la base de datos
    },
    origenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'origen_id',  // Especificar el nombre real de la columna en la base de datos
      references: {
        model: 'origenes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    // Mantenemos el campo dominio como caché para búsquedas rápidas
    dominio: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'dominio',
      comment: 'Caché del dominio para búsquedas rápidas'
    }
  }, {
    timestamps: true,
    tableName: 'scenes',
    // Usar los nombres exactos de las columnas de timestamp
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,  // Habilitar borrado lógico
    underscored: true,  // Usar nombres de columnas con guión bajo
    // Deshabilitar los campos createdAt y updatedAt si no los necesitas
    // timestamps: false,
  });

  return Scene;
};
