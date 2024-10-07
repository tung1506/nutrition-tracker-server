const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     description: Allows a user to register by providing a username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Error registering user
 */
router.post('/register', UserController.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Log in a user
 *     description: Allows a user to log in by providing a username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid username or password
 */
router.post('/login', UserController.login);



module.exports = router;
