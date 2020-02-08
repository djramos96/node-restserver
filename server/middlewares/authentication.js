const jwt = require('jsonwebtoken');

// ==========================
// Verificar token
// ==========================

let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });
};

// ==========================
// Verificar token imagenes
// ==========================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.authorization;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });
};

// ==========================
// Verificar AdminRole
// ==========================

let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next()
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Permiso denegado, usuario no administrador'
            }
        });
    }
};



module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}