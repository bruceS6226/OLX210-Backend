const express = require('express');
const cors = require('cors');
const routesUser = require('./src/routes/usuarioRoutes');
const dotenv = require('dotenv');
const path = require('path');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3000';
        this.config();
        this.listen();
        this.midlewares();
        this.routes();
    }

    config() {
        //configuración dotenv
        dotenv.config();
    }

    //iniciar aplicación
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor funcionando en el puerto ' + this.port);
        });
    }

    //importar rutas
    routes() {
        this.app.use('/api/users/', routesUser);
        this.app.use('/api/users/uploads', express.static(path.join(__dirname, '/uploads')));
    }

    //middlewares (funciones que se ejecutan antes de las peticiones de los usuarios)
    midlewares() {
        this.app.use(express.json());
        this.app.use(cors());
    }
}

const server = new Server();
