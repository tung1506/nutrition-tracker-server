const UserService = require('../services/user/userService');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    if (req.path === '/users/login' || req.path === '/users/register') {
        return next();
    }

    const sessionToken = req.session;

    if (!sessionToken) {
        return res.status(401).json({ message: 'Unauthorized: No session token provided' });
    }

    try {
        const validSession = await UserService.validateSession(sessionToken);
        const userId = await UserService.getUserIdFromSession(validSession);

        req.userId = userId;
        req.session = validSession;

        next();
    } catch (error) {
        return res.status(401).json({ message: `Unauthorized: ${error.message}` });
    }
};

module.exports = authMiddleware;
