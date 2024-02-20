const { ClaseUsuario } = require('../models/clase_usuario');

const obtenerClasesUsuario = async (req, res) => {
    try {
        const listaClasesUsuarios = await ClaseUsuario.findAll();
        res.json(listaClasesUsuarios);
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar obtener los clases de usuario',
            error: error
        });
    }
};

const obtenerClaseUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        //validacion si el usuario existe en la base de datos
        const claseUsuarioExistente = await ClaseUsuario.findByPk(id);
        if (!claseUsuarioExistente) {
            return res.status(404).json({
                msg: `No se encontró un usuario`
            });
        }
        res.json(claseUsuarioExistente);
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar obtener el usuario',
            error: error
        });
    }
};

module.exports = { obtenerClasesUsuario, obtenerClaseUsuario };
