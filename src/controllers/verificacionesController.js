'use strict'

const { UserOtpVerification } = require('../models/user_otp_verification.js');
const { Usuario } = require('../models/usuario.js');
const {getTemplate, sendEmail} = require('../verificaciones/mailConfig.js');
const bcrypt = require('bcryptjs');

const verificarCorreo = async (req, res) => {
    try{
    const data = req.body;
    
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const fechaExpiracion = new Date();

    //hash the otp
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newOTPVerification = await  UserOtpVerification.create({
        id_usuario: data.id_usuario,
        otp: hashedOTP,
        fecha_creado: new Date(),
        fecha_expiracion: fechaExpiracion.setDate(fechaExpiracion.getDate() + 1 )
    });
    //res.json(newOTPVerification);

    //save otp record
    //await newOTPVerification.save();

    //const otp = data.clave;
    console.log("correo electronico enviado a: ", data.correo)
    const template = getTemplate(data.nombre, otp);
    await sendEmail(data.correo, 'Email de verificación', template);

    //.then(res.status(200).send({message: 'Finalizado con exito'}))
    res.json({
        status: "PENDIENTE",
        message: "Verificacion otp enviada",
        data: {
            id_usuario: data.id_usuario,
            email: data.correo
        }
    })

    } catch (error) {
        // res.status(400).json({
        //     msg: 'Ha ocurrido un error al intentar enviar un el correo electrónico',
        //     error: error
        // });
        res.json({
            status: "FALLIDO",
            message: error.message,
        })

        //console.log(error)
    }
}

const validarOTP = async(req, res) => {
    try{
        let { id_usuario, otp } = req.body;
        if(!id_usuario || !otp){
            throw Error("No se permiten detalles vacios en OTP")
        } else {
            const UserOtpVerificationRecords = await UserOtpVerification.findAll({
                id_usuario,
            });
            if(UserOtpVerificationRecords.length <=0){
                // no record found
                throw new Error(
                    "El registro de cuenta no existe o ya ha sido verificado. Por favor registrate o inicia sesión"
                );
            } else {
                // user otp record exist 
                const { fecha_expiracion } = UserOtpVerificationRecords[0];
                const hashedOTP = UserOtpVerificationRecords[0].otp;
                console.log(fecha_expiracion)
                console.log(hashedOTP)
               

                const fechaExpiracion = new Date(fecha_expiracion);

                console.log(fechaExpiracion < Date.now())
                
                if(fechaExpiracion < Date.now()){
                    // User otp record has expired
                    await UserOtpVerification.destroy({ where: { id_usuario: id_usuario } });
                    throw new Error("El código a caducado, por favor solicite uno nuevamente");
                } else {
                    const validarOTP = await bcrypt.compare(otp, hashedOTP);
                    if(!validarOTP){
                        //supplied otp is wrong
                        throw new Error("Codigo invalido. Revisa tu correo");
                    } else {
                        // sucess
                        await Usuario.update({ correo_verificado: true }, { where: { id_usuario: id_usuario } });
                        await UserOtpVerification.destroy({ where: { id_usuario: id_usuario } });
                        res.json({
                            status: "VERIFICADO",
                            message: 'Verificación exitosa',
                        })
                    }
                }
            }
        }
    } catch (error) {
        res.json({
            status: "FALLO",
            message: error.message
        })
    }
} 

const reenviarOTP = async(req, res) => {
    try{
        let {id_usuario, correo } = req.body;
        if(!id_usuario || !correo) {
            console.log(id_usuario)
            throw Error("No se permiten detalles de usuario vacíos.")
        } else{
            //delete eisting recors and resend 
            await UserOtpVerification.destroy({ where: { id_usuario: id_usuario } });
            const req = {
                body: {
                    id_usuario: id_usuario, // El ID del usuario
                    correo: correo // El correo electrónico del usuario
                }
            };
            verificarCorreo(req, res);
        } 
    } catch (error){
        res.json({
            status: "FALLO",
            message: error.message
        })
    }
}

module.exports = {
    verificarCorreo,
    validarOTP,
    reenviarOTP
}