const { TipoDocumento } = require('../models/tipo_documento');

const obtenerTiposDocumento = async (req, res) => {
    try {
        const listaTiposDocumentos = await TipoDocumento.findAll();
        res.json(listaTiposDocumentos);
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar obtener los tipos de documento',
            error: error
        });
    }
};

const obtenerTipoDocumento = async (req, res) => {
    try {
        const { id } = req.params;
        //validacion si el usuario existe en la base de datos
        const tipoDocumentoExistente = await TipoDocumento.findByPk(id);
        if (!tipoDocumentoExistente) {
            return res.status(404).json({
                msg: `No se encontró un usuario`
            });
        }
        res.json(tipoDocumentoExistente);
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar obtener el usuario',
            error: error
        });
    }
};

module.exports = { obtenerTiposDocumento, obtenerTipoDocumento };
