const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/connection');
const { TipoUsuario } = require('./tipo_usuario');
const { TipoDocumento } = require('./tipo_documento');
const { ClaseUsuario } = require('./clase_usuario');

class Usuario extends Model { }

Usuario.init(
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_usuario',
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    genero: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contrasenia: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'contrasenia',
    },
    fecha_nacimiento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numero_documento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_tipo_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_tipo_usuario',
    },
    id_tipo_documento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_tipo_documento',
    },
    id_clase_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_clase_usuario',
    },
    correo_verificado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: false,
  }
);
Usuario.belongsTo(TipoUsuario, {
  foreignKey: 'id_tipo_usuario',
  as: 'tipo_usuario',
});
Usuario.belongsTo(TipoDocumento, {
  foreignKey: 'id_tipo_documento',
  as: 'tipo_documento',
});
Usuario.belongsTo(ClaseUsuario, {
  foreignKey: 'id_clase_usuario',
  as: 'clase_usuario',
});

module.exports = { Usuario };