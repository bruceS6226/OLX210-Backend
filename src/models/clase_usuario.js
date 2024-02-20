const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/connection');

class ClaseUsuario extends Model { }

ClaseUsuario.init(
  {
    id_clase_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_clase_usuario',
    },
    nombre_clase_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ClaseUsuario',
    tableName: 'clases_usuario',
    timestamps: false,
  }
);

module.exports = { ClaseUsuario };
