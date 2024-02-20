const bcrypt = require('bcryptjs');
const { Usuario } = require('../models/usuario');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { subirImagen } = require('../middlewares/cargarImagenMiddleware');
const { TipoUsuario } = require('../models/tipo_usuario');
const { TipoDocumento } = require('../models/tipo_documento');
const { ClaseUsuario } = require('../models/clase_usuario');

const crearUsuario = async (req, res) => {
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
            const existeCorreo = await Usuario.findOne({ where: { correo: correo } });
            if (existeCorreo) {
                return res.status(400).json({
                    msg: `Ya existe un usuario con el correo: ${correo}`
                });
            }
            //validacion si el telefono existe en la base de datos
            const existeTelefono = await Usuario.findOne({ where: { telefono: telefono } });
            if (existeTelefono) {
                return res.status(400).json({
                    msg: `Ya existe un usuario con el teléfono: ${telefono}`
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

            const nuevoUsuario = await Usuario.create({
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
            //obtener información adicional
            const tipoUsuario = await TipoUsuario.findByPk(nuevoUsuario.id_tipo_usuario);
            const tipoDocumento = await TipoDocumento.findByPk(nuevoUsuario.id_tipo_documento);
            const claseUsuario = await ClaseUsuario.findByPk(nuevoUsuario.id_clase_usuario);

            const token = jwt.sign({
                correo: correo
            }, process.env.SECRET_KEY || 'claveSecretaOLX8');
            res.json({
                token: token,
                id_usuario: nuevoUsuario.id_usuario,
                tipo_usuario: tipoUsuario,
                tipo_documento: tipoDocumento,
                clase_usuario: claseUsuario,
            });
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar agregar usuario',
            error: error
        });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;
        //validacion si el usuario existe en la base de datos
        const existeUsuario = await Usuario.findOne({ where: { correo: correo } });
        if (!existeUsuario) {
            return res.status(400).json({
                msg: `No existe un usuario con el correo: ${correo}`
            });
        }
        //validacion contraseña
        const contraseniaValida = await bcrypt.compare(contrasenia, existeUsuario.contrasenia);
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
            id_usuario: existeUsuario.id_usuario
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar ingresar',
            error: error
        });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const listaUsuarios = await Usuario.findAll();
        res.json(listaUsuarios);
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar obtener usuarios',
            error: error
        });
    }
};

const obtenerUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        //validacion si el usuario existe en la base de datos
        const usuarioExistente = await Usuario.findByPk(id);
        if (!usuarioExistente) {
            return res.status(404).json({
                msg: `No se encontró un usuario`
            });
        }
        res.json(usuarioExistente);
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar obtener el usuario',
            error: error
        });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, telefono, genero, fecha_nacimiento, ubicacion, id_tipo_usuario,
            id_tipo_documento, id_clase_usuario, numero_documento } = req.body;
        //validar si el usuario existe en la base de datos
        const usuarioExistente = await Usuario.findByPk(id);
        if (!usuarioExistente) {
            return res.status(404).json({
                msg: `No se encontró el usuario`
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
            if (nombre) usuarioExistente.nombre = nombre;
            if (apellido) usuarioExistente.apellido = apellido;
            if (telefono) usuarioExistente.telefono = telefono;
            if (genero) usuarioExistente.genero = genero;
            if (fecha_nacimiento) usuarioExistente.fecha_nacimiento = fecha_nacimiento;
            if (ubicacion) usuarioExistente.ubicacion = ubicacion;
            if (id_tipo_usuario) usuarioExistente.id_tipo_usuario = id_tipo_usuario;
            if (id_tipo_documento) usuarioExistente.id_tipo_documento = id_tipo_documento;
            if (id_clase_usuario) usuarioExistente.id_clase_usuario = id_clase_usuario;
            if (numero_documento) usuarioExistente.numero_documento = numero_documento;
            //verificar si se subio una nueva foto y actualizar la ruta en la base de datos
            if (req.file) {
                usuarioExistente.foto = path.join('uploads', req.file.filename);
            }
            //guardar los cambios en la base de datos
            await usuarioExistente.save();
            res.json({
                msg: `Usuario actualizado exitosamente`
            });
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar actualizar el usuario',
            error: error
        });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        //validar si el usuario existe en la base de datos
        const usuarioExistente = await Usuario.findByPk(id);
        if (!usuarioExistente) {
            return res.status(404).json({
                msg: `No se encontró al usuario`
            });
        }
        //usuario administrador
        if (usuarioExistente.id_usuario == 1) {
            return res.status(404).json({
                msg: `Este usuario no se puede eliminar`
            });
        }
        //eliminar el usuario de la base de datos
        await usuarioExistente.destroy();
        res.json({
            msg: `El usuario ${usuarioExistente.nombre} ${usuarioExistente.apellido} fue eliminado exitosamente`
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar eliminar el usuario',
            error: error
        });
    }

};

module.exports = { crearUsuario, loginUsuario, obtenerUsuarios, actualizarUsuario, eliminarUsuario, obtenerUsuario };