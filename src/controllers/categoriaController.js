const { Categoria } = require('../models/categoria');
const multer = require('multer');
const { subirImagen } = require('../middlewares/cargarImagenMiddleware');

const crearCategoria = async (req, res) => {
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
            // Obtener los datos de la categoría desde el cuerpo de la solicitud
            const { nombre_categoria, descripcion_categoria } = req.body;

            // Crear la categoría en la base de datos
            const nuevaCategoria = await Categoria.create({
                nombre_categoria,
                descripcion_categoria,
            });

            res.json(nuevaCategoria); // Responder con la nueva categoría creada
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar agregar categoría',
            error: error
        });
    }
};

const obtenerCategorias = async (req, res) => {
    try {
        // Obtener todas las categorías desde la base de datos
        const listaCategorias = await Categoria.findAll();
        res.json(listaCategorias); // Responder con la lista de categorías
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar obtener categorías',
            error: error
        });
    }
};

const obtenerCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        // Buscar la categoría por su ID en la base de datos
        const categoriaExistente = await Categoria.findByPk(id);
        if (!categoriaExistente) {
            return res.status(404).json({
                msg: `No se encontró una categoría`
            });
        }
        res.json(categoriaExistente); // Responder con la categoría encontrada
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar obtener la categoría',
            error: error
        });
    }
};

const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_categoria, descripcion_categoria } = req.body;
        // Buscar la categoría por su ID en la base de datos
        const categoriaExistente = await Categoria.findByPk(id);
        if (!categoriaExistente) {
            return res.status(404).json({
                msg: `No se encontró la categoría`
            });
        }
        // Actualizar los campos proporcionados
        if (nombre_categoria) categoriaExistente.nombre_categoria = nombre_categoria;
        if (descripcion_categoria) categoriaExistente.descripcion_categoria = descripcion_categoria;
        // Guardar los cambios en la base de datos
        await categoriaExistente.save();
        res.json({
            msg: `Categoría actualizada exitosamente`
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar actualizar la categoría',
            error: error
        });
    }
};

const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        // Buscar la categoría por su ID en la base de datos
        const categoriaExistente = await Categoria.findByPk(id);
        if (!categoriaExistente) {
            return res.status(404).json({
                msg: `No se encontró la categoría`
            });
        }
        // Eliminar la categoría de la base de datos
        await categoriaExistente.destroy();
        res.json({
            msg: `La categoría ${categoriaExistente.nombre_categoria} fue eliminada exitosamente`
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error al intentar eliminar la categoría',
            error: error
        });
    }
};

module.exports = { 
    crearCategoria, 
    obtenerCategorias, 
    obtenerCategoria, 
    actualizarCategoria, 
    eliminarCategoria 
};
