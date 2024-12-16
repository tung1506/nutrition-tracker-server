import express from 'express';
const userRoutes = require('./user.js');
const foodRoutes = require('./food.js');
const shoppingListRoutes = require('./shoppingList.js');
const mealRoutes = require('./meal.js');

let router = express.Router();

let initWebRoutes = (app) => {
    app.use("/users", userRoutes);
    app.use("/food", foodRoutes);
    app.use("/shopping-list", shoppingListRoutes);
    app.use("/meals", mealRoutes)
}

module.exports = initWebRoutes;