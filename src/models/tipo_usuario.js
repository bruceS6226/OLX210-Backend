const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/connection');

class TipoUsuario extends Model { }

TipoUsuario.init(
  {
    id_tipo_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_tipo_usuario',
    },
    nombre_tipo_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TipoUsuario',
    tableName: 'tipos_usuario',
    timestamps: false,
  }
);

module.exports = { TipoUsuario };
