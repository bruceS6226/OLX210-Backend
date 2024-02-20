const { Subcategoria } = require('../models/subCategoria');
const multer = require('multer');
const path = require('path');
const { subirImagen } = require('../middlewares/cargarImagenMiddleware');

const crearSubcategoria = async (req, res) => {
    try {
        // Manejar la subida de la imagen utilizando Multer
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
            // Obtener los datos de la subcategoría desde el cuerpo de la solicitud
            const { id_categoria, nombre_subcategoria, descripcion_subcategoria } = req.body;

            // Crear la subcategoría en la base de datos
            const nuevaSubcategoria = await Subcategoria.create({
                id_categoria,
                nombre_subcategoria,
                descripcion_subcategoria,
            });

            res.json(nuevaSubcategoria); // Responder con la nueva subcategoría creada
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar agregar subcategoría',
            error: error
        });
    }
};

const obtenerSubcategorias = async (req, res) => {
    try {
        // Obtener todas las subcategorías desde la base de datos
        const listaSubcategorias = await Subcategoria.findAll();
        res.json(listaSubcategorias); // Responder con la lista de subcategorías
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar obtener subcategorías',
            error: error
        });
    }
};

const obtenerSubcategoria = async (req, res) => {
    try {
        const { id } = req.params;
        // Buscar la subcategoría por su ID en la base de datos
        const subcategoriaExistente = await Subcategoria.findByPk(id);
        if (!subcategoriaExistente) {
            return res.status(404).json({
                msg: `No se encontró una subcategoría`
            });
        }
        res.json(subcategoriaExistente); // Responder con la subcategoría encontrada
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar obtener la subcategoría',
            error: error
        });
    }
};

const actualizarSubcategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_categoria, nombre_subcategoria, descripcion_subcategoria } = req.body;
        // Buscar la subcategoría por su ID en la base de datos
        const subcategoriaExistente = await Subcategoria.findByPk(id);
        if (!subcategoriaExistente) {
            return res.status(404).json({
                msg: `No se encontró la subcategoría`
            });
        }
        // Actualizar los campos proporcionados
        if (id_categoria) subcategoriaExistente.id_categoria = id_categoria;
        if (nombre_subcategoria) subcategoriaExistente.nombre_subcategoria = nombre_subcategoria;
        if (descripcion_subcategoria) subcategoriaExistente.descripcion_subcategoria = descripcion_subcategoria;
        // Guardar los cambios en la base de datos
        await subcategoriaExistente.save();
        res.json({
            msg: `Subcategoría actualizada exitosamente`
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar actualizar la subcategoría',
            error: error
        });
    }
};

const eliminarSubcategoria = async (req, res) => {
    try {
        const { id } = req.params;
        // Buscar la subcategoría por su ID en la base de datos
        const subcategoriaExistente = await Subcategoria.findByPk(id);
        if (!subcategoriaExistente) {
            return res.status(404).json({
                msg: `No se encontró la subcategoría`
            });
        }
        // Eliminar la subcategoría de la base de datos
        await subcategoriaExistente.destroy();
        res.json({
            msg: `La subcategoría ${subcategoriaExistente.nombre_subcategoria} fue eliminada exitosamente`
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar eliminar la subcategoría',
            error: error
        });
    }
};

module.exports = { 
    crearSubcategoria, 
    obtenerSubcategorias, 
    obtenerSubcategoria, 
    actualizarSubcategoria, 
    eliminarSubcategoria 
};
