const mysql = require('mysql2');
const {database} = require('./keys');
const {promisify } = require('util');


const pool = mysql.createPool(database);

pool.getConnection((err, conn) => {
    if(err){
       if (err.code == 'PROTOCOL_CONNECTION_LOST' ) {
           console.log('LA CONEXION DE LA BASE DE DATOS FUE CERRADA');
       } 
       if (err.code == 'ECONNREFUSED') {
           console.log('LA CONEXION DE LA BASE DE DATOS FUE RECHAZADA');
       }
       if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has to many connections');
      }
    }
    if(conn) conn.release();
    console.log('LA BASE DE DATOS ESTA CONECTADA');
    return;
});

pool.query = promisify(pool.query);

module.exports = pool;