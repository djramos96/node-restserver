const express = require('express');
const _ = require('underscore');
let Categoria = require('../models/categoria');
let { verificaToken, verificaAdminRole } = require('../middlewares/authentication');

let app = express();


// ==================================
//  Mostrar todas las categorias
// ==================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, conteo) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    num_elementos: conteo,
                    categorias
                });
            });


        });

});

// ==================================
//  Mostrar todas las categorias
// ==================================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, 'nombre usuario', (err, categoria) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });


    });
});

// ==================================
//  Crear nueva categoría
// ==================================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id,
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: categoriaDB
        });
    });

});

//Devuelve la nueva categoría
// req.usuario._id

// ==================================
//  Actualizar categoría
// ==================================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });

    //Devuelve la nueva categoría
    // req.usuario._id

});

// ==================================
//  Eliminar categoría
// ==================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }

    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });

    // solo puede borrar el administrador, eliminar fisicamente
    //Devuelve la nueva categoría
    // req.usuario._id
    //Categoria.findByIdAndDelete

});


module.exports = app;