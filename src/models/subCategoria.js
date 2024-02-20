const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/connection');
const { Categoria } = require('./categoria');

// Definición del modelo de Subcategoría
class Subcategoria extends Model { }

Subcategoria.init(
    {
        id_subcategoria: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_categoria: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        nombre_subcategoria: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        descripcion_subcategoria: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Subcategoria',
        tableName: 'subcategorias',
        timestamps: false,
    }
);

// Definición de la relación entre Categoría y Subcategoría
Subcategoria.belongsTo(Categoria, {
    foreignKey: 'id_categoria',
    as: 'categoria',
});

module.exports = { Subcategoria };
