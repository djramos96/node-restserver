const express = require('express');
const app = express();

// Metodos GET POST PUT DELETE
app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;