// =============================
// Puerto
// =============================

process.env.PORT = process.env.PORT || 3000;

// =============================
// Entorno
// =============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =============================
// Puerto
// =============================

let urlDB;

// if (process.env.NODE_ENV === 'dev') {
//     urlDB = 'mongodb://localhost:27017/cafe'
// } else {
urlDB = 'mongodb+srv://redactor:0HZKDHberSZxwGe5@cluster0-cll89.mongodb.net/cafe'
    // }

process.env.URLDB = urlDB;