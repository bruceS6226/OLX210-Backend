const { Router } = require('express');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categoriaController');
const validateToken = require('./validate-token');

const router = Router();

// Rutas para categorías
router.post('/createCategory', validateToken, crearCategoria);
router.get('/categorys', validateToken, obtenerCategorias);
router.get('/category/:id', validateToken, obtenerCategoria);
router.put('/update/:id', validateToken, actualizarCategoria);
router.delete('/:id', validateToken, eliminarCategoria);

module.exports = router;

