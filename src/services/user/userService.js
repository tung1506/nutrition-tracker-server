const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
import db from '../../models/index';

const JWT_SECRET = process.env.JWT_SECRET;

class UserService {
    async register(userData) {
        try {
            const existingUser = await db.User.findOne({ where: { username: userData.username } });

            if (existingUser) {
                throw new Error('Username already exists');
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const newUser = await db.User.create({
                ...userData,
                password: hashedPassword,
            });

            const session = await this.generateSession(newUser.id);

            await newUser.update({ session });

            return newUser;
        } catch (error) {
            throw new Error(`Error registering user: ${error.message}`);
        }
    }

    async login(username, password) {
        try {
            const user = await db.User.findOne({ where: { username } });

            if (!user) {
                throw new Error('User not found');
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                throw new Error('Invalid password');
            }

            let session = await this.generateSession(user.id);

            return { session };
        } catch (error) {
            throw new Error(`Error logging in: ${error.message}`);
        }
    }

    async validateSession(sessionToken) {
        try {
            const decoded = jwt.verify(sessionToken, JWT_SECRET);
            const userId = decoded.userId;
            const user = await db.User.findByPk(userId);

            if (!user) {
                throw new Error('User not found');
            }

            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp < currentTime) {
                const newSession = await this.generateSession(userId);
                await user.update({ session: newSession });
                return newSession;
            }

            return sessionToken;
        } catch (error) {
            throw new Error(`Invalid session token: ${error.message}`);
        }
    }

    async generateSession(userId) {
        try {
            const token = jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: '1h' });

            return token;
        } catch (error) {
            throw new Error(`Error generating session: ${error.message}`);
        }
    }

    async getUserIdFromSession(sessionToken) {
        try {
            const decoded = jwt.verify(sessionToken, JWT_SECRET);
            return decoded.userId;
        } catch (error) {
            throw new Error(`Invalid session token: ${error.message}`);
        }
    }
}

module.exports = new UserService();
