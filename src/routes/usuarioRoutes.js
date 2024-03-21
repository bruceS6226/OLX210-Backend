const { Router } = require('express');
const { loginUsuario, crearUsuario, obtenerUsuarios, actualizarUsuario, eliminarUsuario, obtenerUsuario} = require('../controllers/usuariosController');
const validateToken = require('./validate-token');
const { obtenerTiposUsuario, obtenerTipoUsuario } = require('../controllers/tiposUsuarioController');
const { obtenerTiposDocumento, obtenerTipoDocumento } = require('../controllers/tiposDocumentoController');
const { obtenerClasesUsuario, obtenerClaseUsuario } = require('../controllers/clasesUsuarioController');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, eliminarCategoria} = require('../controllers/categoriaController');
const { crearSubcategoria, obtenerSubcategoria, obtenerSubcategorias, eliminarSubcategoria, actualizarSubcategoria} = require('../controllers/subCategoriaController');
const { crearAdministrador, loginAdministrador, obtenerAdministradores, actualizarAdministrador, eliminarAdministrador, obtenerAdministrador } = require('../controllers/administradoresController');
const { verificarCorreo, validarOTP, reenviarOTP } = require('../controllers/verificacionesController');

const router = Router();
//categorias
router.post('/createCategory', validateToken, crearCategoria);
router.get('/categories', validateToken, obtenerCategorias);
router.get('/category/:id', validateToken, obtenerCategoria);
router.put('/category/:id', validateToken, actualizarCategoria);
router.delete('/category/:id', validateToken, eliminarCategoria);
//subcategorias
router.post('/createSubcategory', validateToken, crearSubcategoria);
router.get('/subcategories', validateToken, obtenerSubcategorias);
router.get('/subcategory/:id', validateToken, obtenerSubcategoria);
router.delete('/subcategory/:id', validateToken, eliminarSubcategoria);
router.put('/subcategory/:id', validateToken, actualizarSubcategoria);
//tipos de usuario
router.get('/types-user', obtenerTiposUsuario);
router.get('/types-user/:id', validateToken, obtenerTipoUsuario);
//tipos de documento
router.get('/types-document', obtenerTiposDocumento);
router.get('/types-document/:id', validateToken, obtenerTipoDocumento);
//clases de usuario
router.get('/classes-user', obtenerClasesUsuario);
router.get('/classes-user/:id', validateToken, obtenerClaseUsuario);
//administradores
router.post('/admin', crearAdministrador);
router.post('/admin/login', loginAdministrador);
router.get('/administradores', obtenerAdministradores);
router.get('/admin/:id', obtenerAdministrador);
router.put('/admin/:id', validateToken, actualizarAdministrador);
router.delete('/admin/:id', validateToken, eliminarAdministrador);
//usuarios
router.post('/usuario', crearUsuario);
router.post('/usuario/login', loginUsuario);
router.get('/usuarios', obtenerUsuarios);
router.get('/usuario/:id', validateToken, obtenerUsuario);
router.put('/usuario/:id', validateToken, actualizarUsuario);
router.delete('/usuario/:id', validateToken, eliminarUsuario);
//Verificar correo electrónico 
router.post('/verificarCorreo', verificarCorreo);
router.post('/validarOTP', validarOTP);
router.post('/reenviarCodigoOTP', reenviarOTP);

module.exports = router;
