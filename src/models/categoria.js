const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/connection');

// Definición del modelo de Categoría
class Categoria extends Model {}

Categoria.init(
  {
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_categoria: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion_categoria: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Categoria',
    tableName: 'categorias',
    timestamps: false,
  }
);

module.exports = { Categoria };