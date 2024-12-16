const shoppingListService = require('../services/shoppingListService');

const ShoppingListController = {
    // Create a new shopping list entry
    async createShoppingList(req, res) {
        try {
            // Expecting an array of objects in the request body
            const shoppingListItems = req.body;

            // Validate that the list is not empty
            if (!Array.isArray(shoppingListItems) || shoppingListItems.length === 0) {
                return res.status(400).json({ message: 'Please provide a valid shopping list.' });
            }

            // Loop through each item and add user_id
            const userId = req.userId;  // Extracted from the middleware

            const shoppingListData = shoppingListItems.map(item => ({
                ...item,
                user_id: userId,  // Add user_id to each item
            }));

            // Call the service to create all items in the shopping list
            const createdShoppingList = await shoppingListService.createShoppingList(shoppingListData, userId);

            res.status(201).json(createdShoppingList);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update an existing shopping list entry
    async updateShoppingList(req, res) {
        try {
            const { id } = req.params;
            const { quantity, is_bought, date, note } = req.body;

            const updatedShoppingList = await shoppingListService.updateShoppingList(id, {
                quantity,
                is_bought,
                date,
                note,
            });

            return res.status(200).json(updatedShoppingList);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    // Delete a shopping list entry
    async deleteShoppingList(req, res) {
        try {
            const { id } = req.params;

            const result = await shoppingListService.deleteShoppingList(id);

            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async getShoppingList(req, res) {
        try {
            const userId = req.userId;  // Extract userId from the middleware
            const page = parseInt(req.query.page) || 1;  // Default page 1
            const limit = parseInt(req.query.limit) || 10;  // Default limit 10

            const result = await shoppingListService.getShoppingListByUserId(userId, page, limit);

            res.status(200).json({
                shoppingLists: result.shoppingLists,
                totalItems: result.totalItems,
                totalPages: result.totalPages,
                currentPage: result.currentPage,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getShoppingListByDate(req, res) {
        try {
            const userId = req.userId;
            const { fromDate, toDate } = req.query;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            // Validate date inputs
            if (!fromDate || !toDate) {
                return res.status(400).json({
                    message: 'Both fromDate and toDate are required'
                });
            }

            // Optional: Add date format validation
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(fromDate) || !dateRegex.test(toDate)) {
                return res.status(400).json({
                    message: 'Dates must be in YYYY-MM-DD format'
                });
            }

            const result = await shoppingListService.getShoppingListByDate(
                userId,
                fromDate,
                toDate,
                page,
                limit
            );

            res.status(200).json({
                shoppingLists: result.shoppingLists,
                totalItems: result.totalItems,
                totalPages: result.totalPages,
                currentPage: result.currentPage,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = ShoppingListController;
