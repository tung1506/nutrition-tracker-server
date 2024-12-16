const UserService = require('../services/userService');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    if (req.path === '/users/login' || req.path === '/users/register') {
        return next();
    }

    const sessionToken = req.headers['authorization']?.split(' ')[1];

    if (!sessionToken) {
        return res.status(401).json({ message: 'Unauthorized: No session token provided' });
    }

    try {
        const { userId, validSession } = await UserService.validateSessionAndGetUserId(sessionToken);
        // Set userId and session on the request object
        req.userId = userId;
        req.session = validSession;

        next();
    } catch (error) {
        return res.status(401).json({ message: `Unauthorized: ${error.message}` });
    }
};

module.exports = authMiddleware;
