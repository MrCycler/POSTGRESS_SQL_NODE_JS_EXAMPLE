const { Client } = require('pg');
const express = require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

const connectionData = {
    user: 'postgres',
    host:'',
    database: 'TUMI_TEST',
    password: '1234',   
    port: 5432,
  }
   
let respuesta = {
    error: false,
    codigo: 200,
    mensaje: ''
   };

const client = new Client(connectionData)
client.connect()
let createTableQuery = `CREATE TABLE IF NOT EXISTS indicador(ID SERIAL, C varchar(40) NOT NULL, I int NOT NULL, D decimal NOT NULL, PRIMARY KEY (ID));`
client.query(createTableQuery)
    .then(response => {
        console.log(response.rows);
        //client.end();
    })
    .catch(err => {
        console.log('error');
        //client.end();
    })


app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});

app.get('/', function (req, res) {
    respuesta = {
        error: true,
        codigo: 200,
        mensaje: 'Punto de inicio'
       };
       res.send(respuesta);
});

app.get('/usuario', function (req, res) {
    respuesta = {
     error: false,
     codigo: 200,
     mensaje: ''
    };


    if(req.query.C === '' || req.query.I=== ''|| req.query.D=== '') {
     respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Entidad no creada'
     };
    } else {
     respuesta = {
      error: false,
      codigo: 200,
      mensaje: 'Insertada entidad',
      caracter: req.query.C,
      entero: req.query.I,
      decimal: req.query.D,

     };
    }
    res.send(respuesta);
    //client.connect();
    let EntityQuery ='INSERT INTO indicador(C, I, D) VALUES($1, $2, $3) RETURNING *'
    let values = [req.query.C, parseInt(req.query.I,10),parseFloat(req.query.D)]
    client.query(EntityQuery,values)
    .then(response => {
        console.log(response.rows)
        //client.end()
    })
    .catch(err => {
        console.log(err)
        //client.end()
    })

   });