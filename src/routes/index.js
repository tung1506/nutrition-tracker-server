import express from 'express';
const userRoutes = require('./user.js');

let router = express.Router();

let initWebRoutes = (app) => {

    return app.use("/users", userRoutes);
}

module.exports = initWebRoutes;