const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
    constructor() {
        this._client = null;
        this._isConnected = false;
        this._connectionPromise = null;
    }

    // Lazy initialization method
    async _initClient() {
        // If already initialized, return
        if (this._client) return this._client;

        // If a connection is in progress, wait for it
        if (this._connectionPromise) {
            return this._connectionPromise;
        }

        // Create connection promise
        this._connectionPromise = new Promise((resolve, reject) => {
            try {
                // Create Redis client
                const client = redis.createClient({
                    url: process.env.REDIS_URL || 'redis://localhost:6379',
                    // Additional connection options
                    socket: {
                        connectTimeout: 5000,
                        reconnectStrategy: (retries) => {
                            if (retries > 5) return new Error('Too many connection attempts');
                            return retries * 1000;
                        }
                    }
                });

                // Setup event listeners
                client.on('connect', () => {
                    console.log('Redis client connecting');
                });

                client.on('ready', () => {
                    console.log('Redis client is ready');
                    this._isConnected = true;
                    this._client = client;
                    resolve(client);
                });

                client.on('error', (err) => {
                    console.warn('Redis Client Error:', err);
                    this._isConnected = false;
                    // Reject the promise, but don't throw
                    reject(err);
                });

                // Initiate connection
                client.connect().catch(reject);
            } catch (err) {
                console.warn('Error creating Redis client:', err);
                reject(err);
            }
        });

        return this._connectionPromise;
    }

    // Safely get client, initializing if necessary
    async _getClient() {
        if (!this._client) {
            try {
                await this._initClient();
            } catch (err) {
                console.warn('Failed to get Redis client:', err);
                return null;
            }
        }
        return this._client;
    }

    // Getter for connection status
    get connected() {
        return this._isConnected;
    }

    // Wrapper methods with error handling
    async get(key) {
        try {
            const client = await this._getClient();
            return client ? await client.get(key) : null;
        } catch (err) {
            console.warn('Redis get error:', err);
            return null;
        }
    }

    async setex(key, seconds, value) {
        try {
            const client = await this._getClient();
            return client ? await client.setEx(key, seconds, value) : null;
        } catch (err) {
            console.warn('Redis setex error:', err);
            return null;
        }
    }

    async del(key) {
        try {
            const client = await this._getClient();
            return client ? await client.del(key) : null;
        } catch (err) {
            console.warn('Redis del error:', err);
            return null;
        }
    }

    // Disconnect method
    async disconnect() {
        if (this._client) {
            try {
                await this._client.quit();
                this._isConnected = false;
                this._client = null;
                this._connectionPromise = null;
            } catch (err) {
                console.warn('Error disconnecting Redis:', err);
            }
        }
    }
}

// Export a singleton instance
module.exports = new RedisClient();