const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/connection');

class UserOtpVerification extends Model { }

UserOtpVerification.init(
    {
       id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'id_usuario'
       }, 
       otp: {
        type: DataTypes.STRING,
        allowNull: true,
       },
       fecha_creado: {
        type: DataTypes.DATE,
        allowNull: true,
       },
       fecha_expiracion: {
        type: DataTypes.DATE,
        allowNull: true,
       }
    },
    {
        sequelize,
        modelName: 'UserOtpVerification',
        tableName: 'user_otp_verification',
        timestamps: false,
    }
);

module.exports = {UserOtpVerification}

