require('./config/config');

// requires
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

mongoose.set('useFindAndModify', false);

// inicializacion express
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// Metodos GET POST PUT DELETE
app.use(require('./routes/index'));

// Conectar base de datos
mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    (err, res) => {

        if (err) throw err;

        console.log('Pase de datos ONLINE');
    });


// Listener del puerto
app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
})