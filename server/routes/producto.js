const express = require('express');
const _ = require('underscore');
let Producto = require('../models/producto');
let { verificaToken } = require('../middlewares/authentication');
let app = express();


// =========================
//  Obtener productos
// =========================
app.get('/producto', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    console.log(desde);
    console.log(limite);
    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .skip(desde)
        .limit(limite)
        .exec((err, producto) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                producto
            });


        });
});

// =========================
//  Producto por ID
// =========================
app.get('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, producto) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                producto
            });


        });
});

// =========================
//  Buscar productos
// =========================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, producto) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto
            });

        });
});




// =========================
//  Crear un producto
// =========================
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id,
    });

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoBD
        });
    });
});


// =========================
//  Actualizar un producto
// =========================
app.put('/producto/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, { new: true, runValidators: true }, (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        productoBD.nombre = body.nombre;
        productoBD.categoria = body.categoria;
        productoBD.descripcion = body.descripcion;
        productoBD.categoria = body.categoria;
        productoBD.disponible = body.disponible;

        productoBD.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })
        });
    });
});


// =========================
//  Borrar un producto
// =========================
app.delete('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado',
                }
            });
        }

        productoBD.disponible = false;

        productoBD.save((err, productoEliminado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoEliminado
            })
        });
    });

});

module.exports = app;