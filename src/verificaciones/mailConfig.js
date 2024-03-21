'use strict'
require('dotenv').config()
const nodemailer = require('nodemailer')
const {USER, PASS} = process.env;

const mail = {
    user: "USER",
    pass: "PASS"
}


let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    tls: {
        rejectUnauthorized: false
    },
    secure: false, //True for 465, falase for other ports
    auth: {
        user: mail.user, // generated ethernal user 
        pass: mail.pass, // generated ethernal password 
    },
});

const sendEmail = async (email, subject, html) => {
    try{
        await transporter.sendMail({
            from: `OLX-8 <${ mail.user }>`, //sender address
            to: email, //List of recivers 
            subject, //Subject line
            text: "Confirmación de correo electrónico", // plain text body
            html, // html body
        });
    } catch (error) {
        // res.status(400).json({
        //     msg: 'Algo no va bien con el Email',
        //     error: error
        // });
        console.log('Algo no va bien con el email', error)
    }
}

const getTemplate = (name, otp) => {
    //console.log(otp);
    return `
        <div id="email___content">
            <img src="../../../OLX-8-Frontend/src/assets/img/logoOLX.jpg" alt="">
            <h1>Hola ${ name } </h1>
            <p>Para confirmar tu cuenta, ingresa el siguiente codigo de verificación</p>
            <!-- <a
            href="http://localhost:4040/confirmacion.html"
            target="_blank"
        >Confirmar Cuenta</a> -->
        <h2>Tu código de verificación es: ${ otp }</h2>
    `
};

module.exports = {
    sendEmail,
    getTemplate,
}