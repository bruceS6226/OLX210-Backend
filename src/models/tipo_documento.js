const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/connection');

class TipoDocumento extends Model { }

TipoDocumento.init(
  {
    id_tipo_documento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_tipo_documento',
    },
    nombre_tipo_documento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TipoDocumento',
    tableName: 'tipos_documento',
    timestamps: false,
  }
);

module.exports = { TipoDocumento };
