const bcrypt = require('bcryptjs');
const { Administrador } = require('../models/administrador');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { subirImagen } = require('../middlewares/cargarImagenMiddleware');
const { TipoUsuario } = require('../models/tipo_usuario');
const { TipoDocumento } = require('../models/tipo_documento');
const { ClaseUsuario } = require('../models/clase_usuario');

const crearAdministrador = async (req, res) => {
    try {
        //manejar la subida de la imagen utilizando Multer
        subirImagen(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    msg: 'Error al subir la imagen',
                    error: err,
                });
            } else if (err) {
                return res.status(500).json({
                    msg: 'Error interno del servidor',
                    error: err,
                });
            }
            const { nombre, apellido, correo, telefono, genero, contrasenia, fecha_nacimiento, ubicacion,
                numero_documento, id_tipo_usuario, id_tipo_documento, id_clase_usuario } = req.body;
            //validacion si el correo existe en la base de datos
            const existeCorreo = await Administrador.findOne({ where: { correo: correo } });
            if (existeCorreo) {
                return res.status(400).json({
                    msg: `Ya existe un administrador con el correo: ${correo}`
                });
            }
            //validacion si el telefono existe en la base de datos
            const existeTelefono = await Administrador.findOne({ where: { telefono: telefono } });
            if (existeTelefono) {
                return res.status(400).json({
                    msg: `Ya existe un administrador con el teléfono: ${telefono}`
                });
            }
            //obtener la ruta de la imagen si se subio o establecerla si no hay imagen
            let foto = '';
            if (req.file) {
                foto = path.join('uploads', req.file.filename);
            } else {
                //establecer la imagen por defecto
                foto = path.join('uploads', '2e5a8af2-d1da-4507-aca5-8d86688932c9.png');
            }
            //encriptar contraseña
            const hashedContrasenia = await bcrypt.hash(contrasenia, 10);

            const nuevoAdmin = await Administrador.create({
                foto: foto,
                nombre: nombre,
                apellido: apellido,
                correo: correo,
                telefono: telefono,
                genero: genero,
                contrasenia: hashedContrasenia,
                fecha_nacimiento: fecha_nacimiento,
                ubicacion: ubicacion,
                numero_documento: numero_documento,
                id_tipo_usuario: id_tipo_usuario,
                id_tipo_documento: id_tipo_documento,
                id_clase_usuario: id_clase_usuario,
            });
            const token = jwt.sign({
                correo: correo
            }, process.env.SECRET_KEY || 'claveSecretaOLX8');
            res.json({
                token: token,
                id_administrador: nuevoAdmin.id_administrador
            });
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar agregar administrador',
            error: error
        });
    }
};

const loginAdministrador = async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;
        //validacion si el administrador existe en la base de datos
        const existeAdmin = await Administrador.findOne({ where: { correo: correo } });
        if (!existeAdmin) {
            return res.status(400).json({
                msg: `No existe un administrador con el correo: ${correo}`
            });
        }
        //validacion contraseña
        const contraseniaValida = await bcrypt.compare(contrasenia, existeAdmin.contrasenia);
        if (!contraseniaValida) {
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            });
        }
        //generacion token
        const token = jwt.sign({
            correo: correo
        }, process.env.SECRET_KEY || 'claveSecretaOLX8');
        res.json({
            token: token,
            id_administrador: existeAdmin.id_administrador
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar ingresar',
            error: error
        });
    }
};

const obtenerAdministradores = async (req, res) => {
    try {
        const listaAdmins = await Administrador.findAll();
        res.json(listaAdmins);
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar obtener administradores',
            error: error
        });
    }
};

const obtenerAdministrador = async (req, res) => {
    try {
        const { id } = req.params;
        //validacion si el administrador existe en la base de datos
        const adminExistente = await Administrador.findByPk(id);
        if (!adminExistente) {
            return res.status(404).json({
                msg: `No se encontró un administrador`
            });
        }
        res.json(adminExistente);
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar obtener el administrador',
            error: error
        });
    }
};

const actualizarAdministrador = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, telefono, genero, fecha_nacimiento, ubicacion, id_tipo_usuario,
            id_tipo_documento, id_clase_usuario, numero_documento } = req.body;
        //validar si el administrador existe en la base de datos
        const adminExistente = await Administrador.findByPk(id);
        if (!adminExistente) {
            return res.status(404).json({
                msg: `No se encontró el administrador`
            });
        }
        //manejar la subida de la imagen utilizando el middleware subirImagen
        subirImagen(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    msg: 'Error al subir la imagen',
                    error: err,
                });
            } else if (err) {
                return res.status(500).json({
                    msg: 'Error interno del servidor',
                    error: err,
                });
            }
            //actualizar solo los campos proporcionados
            if (nombre) adminExistente.nombre = nombre;
            if (apellido) adminExistente.apellido = apellido;
            if (telefono) adminExistente.telefono = telefono;
            if (genero) adminExistente.genero = genero;
            if (fecha_nacimiento) adminExistente.fecha_nacimiento = fecha_nacimiento;
            if (ubicacion) adminExistente.ubicacion = ubicacion;
            if (id_tipo_usuario) adminExistente.id_tipo_usuario = id_tipo_usuario;
            if (id_tipo_documento) adminExistente.id_tipo_documento = id_tipo_documento;
            if (id_clase_usuario) adminExistente.id_clase_usuario = id_clase_usuario;
            if (numero_documento) adminExistente.numero_documento = numero_documento;
            //verificar si se subio una nueva foto y actualizar la ruta en la base de datos
            if (req.file) {
                adminExistente.foto = path.join('uploads', req.file.filename);
            }
            //guardar los cambios en la base de datos
            await adminExistente.save();
            res.json({
                msg: `Administrador actualizado exitosamente`
            });
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar actualizar el administrador',
            error: error
        });
    }
};

const eliminarAdministrador = async (req, res) => {
    try {
        const { id } = req.params;
        //validar si el administrador existe en la base de datos
        const adminExistente = await Administrador.findByPk(id);
        if (!adminExistente) {
            return res.status(404).json({
                msg: `No se encontró al administrador`
            });
        }
        //eliminar el administrador de la base de datos
        await adminExistente.destroy();
        res.json({
            msg: `El administrador ${adminExistente.nombre} ${adminExistente.apellido} fue eliminado exitosamente`
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar eliminar el administrador',
            error: error
        });
    }

};

module.exports = { crearAdministrador, loginAdministrador , obtenerAdministradores, actualizarAdministrador, eliminarAdministrador, obtenerAdministrador };