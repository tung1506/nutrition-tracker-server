const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import db from '../models/index';
const redisClient = require('./redisClient');

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

            const session = this.generateSession(newUser.id);

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

            let session = this.generateSession(user.id);

            return { session };
        } catch (error) {
            throw new Error(`Error logging in: ${error.message}`);
        }
    }

    async validateSessionAndGetUserId(sessionToken) {
        try {
            // Check if the session token is provided
            if (!sessionToken) {
                throw new Error('No session token provided');
            }

            // Cached user storage
            let cachedUser = null;

            // Attempt to get from Redis with robust error handling
            try {
                // No need to explicitly connect, client handles connection
                cachedUser = await redisClient.get(sessionToken);
            } catch (cacheError) {
                console.warn('Redis cache retrieval failed', cacheError);
                // Continue with database validation
            }

            // If cached, return user
            if (cachedUser) {
                const user = JSON.parse(cachedUser);
                return {
                    userId: user.id,
                    validSession: sessionToken
                };
            }

            // Verify the token
            const decoded = jwt.verify(sessionToken, JWT_SECRET);
            const userId = decoded.userId;

            // Fetch user from the database
            const user = await db.User.findByPk(userId, {
                attributes: ['id', 'username', 'session']
            });

            if (!user) {
                throw new Error('User not found');
            }

            const currentTime = Math.floor(Date.now() / 1000);

            // Check if token is expired
            if (decoded.exp < currentTime) {
                // Generate a new session
                const newSession = this.generateSession(userId);

                // Update user's session in database
                await user.update({ session: newSession });

                // Cache the new session (with error handling)
                try {
                    await redisClient.setex(newSession, 128 * 3600, JSON.stringify(user));
                } catch (cacheError) {
                    console.warn('Redis cache set failed', cacheError);
                }

                return {
                    userId: user.id,
                    validSession: newSession
                };
            }

            // Cache the valid session (with error handling)
            try {
                await redisClient.setex(sessionToken, 128 * 3600, JSON.stringify(user));
            } catch (cacheError) {
                console.warn('Redis cache set failed', cacheError);
            }

            return {
                userId: user.id,
                validSession: sessionToken
            };
        } catch (error) {
            throw new Error(`Invalid session token: ${error.message}`);
        }
    }

    generateSession(userId) {
        try {
            const token = jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: '128h' });

            return token;
        } catch (error) {
            throw new Error(`Error generating session: ${error.message}`);
        }
    }

    async addUserInfo(userId, userData) {
        try {
            // Find the user
            const user = await db.User.findByPk(userId);

            if (!user) {
                throw new Error('User not found');
            }

            // Validate input data
            const validatedData = this.validateUserInfo(userData);

            // Update user information
            const updatedUser = await user.update(validatedData);

            // Return updated user info, excluding sensitive data
            return {
                id: updatedUser.id,
                username: updatedUser.username,
                name: updatedUser.name,
                phone: updatedUser.phone,
                age: updatedUser.age,
                weight: updatedUser.weight,
                height: updatedUser.height
            };
        } catch (error) {
            throw new Error(`Error updating user info: ${error.message}`);
        }
    }

    // Validation method
    validateUserInfo(userData) {
        const validatedData = {};

        // Name validation
        if (userData.name) {
            if (typeof userData.name !== 'string' || userData.name.length < 2 || userData.name.length > 100) {
                throw new Error('Name must be a string between 2 and 100 characters');
            }
            validatedData.name = userData.name;
        }

        // Phone validation
        if (userData.phone) {
            // Basic phone number validation (adjust regex as needed)
            const phoneRegex = /^[+]?[\d\s()-]{10,15}$/;
            if (!phoneRegex.test(userData.phone)) {
                throw new Error('Invalid phone number format');
            }
            validatedData.phone = userData.phone;
        }

        // Age validation
        if (userData.age !== undefined) {
            const age = Number(userData.age);
            if (isNaN(age) || age < 0 || age > 120) {
                throw new Error('Age must be a number between 0 and 120');
            }
            validatedData.age = age;
        }

        // Weight validation
        if (userData.weight !== undefined) {
            const weight = Number(userData.weight);
            if (isNaN(weight) || weight < 10 || weight > 500) {
                throw new Error('Weight must be a number between 10 and 500');
            }
            validatedData.weight = weight;
        }

        // Height validation
        if (userData.height !== undefined) {
            const height = Number(userData.height);
            if (isNaN(height) || height < 50 || height > 300) {
                throw new Error('Height must be a number between 50 and 300');
            }
            validatedData.height = height;
        }

        return validatedData;
    }
}

module.exports = new UserService();
