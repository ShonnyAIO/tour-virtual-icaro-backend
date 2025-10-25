const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Origen = sequelize.define('Origen', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'nombre',
      comment: 'Nombre descriptivo del origen (ej: Facultad de Ciencias)'
    },
    dominio: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'dominio',
      comment: 'Dominio completo (ej: ciencias.ucv.edu.ve)'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: 'activo'
    },
    configuracion: {
      type: DataTypes.JSONB,
      defaultValue: {},
      field: 'configuracion',
      comment: 'Configuración adicional para el origen (tema, estilos, etc.)'
    }
  }, {
    tableName: 'origenes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true, // Para borrado lógico
    underscored: true
  });

  return Origen;
};
