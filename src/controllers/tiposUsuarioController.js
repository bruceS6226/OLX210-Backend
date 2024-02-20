const { TipoUsuario } = require('../models/tipo_usuario');

const obtenerTiposUsuario = async (req, res) => {
    try {
        const listaTiposUsuarios = await TipoUsuario.findAll();
        res.json(listaTiposUsuarios);
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar obtener los tipos de usuario',
            error: error
        });
    }
};

const obtenerTipoUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        //validacion si el usuario existe en la base de datos
        const tipoUsuarioExistente = await TipoUsuario.findByPk(id);
        if (!tipoUsuarioExistente) {
            return res.status(404).json({
                msg: `No se encontró un usuario`
            });
        }
        res.json(tipoUsuarioExistente);
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar obtener el usuario',
            error: error
        });
    }
};

module.exports = { obtenerTiposUsuario, obtenerTipoUsuario };