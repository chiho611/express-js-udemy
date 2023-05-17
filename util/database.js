// const mysql = require("mysql2");
//
// const pool = mysql.createPool({
//     host:'127.0.0.1',
//     user:'root',
//     database:'node-complete',
//     password:'root'
// })
//
// module.exports = pool.promise();


const Sequelize = require("sequelize");

const sequelize = new Sequelize('node-complete', 'root', 'root', {
    dialect: 'mysql',
    host: '127.0.0.1'
})

module.exports = sequelize;