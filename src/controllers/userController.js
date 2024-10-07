const userService = require('../services/user/userService');

const UserController = {
    async register(req, res) {
        try {
            const newUser = await userService.register(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const { user, session } = await userService.login(username, password);
            res.status(200).json({ user, session });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
};

module.exports = UserController;