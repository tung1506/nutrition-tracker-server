import db from '../models/index';
const { Op } = require('sequelize');

class ShoppingListService {
    async createShoppingList(data, userId) {
        try {
            // Validate and check for duplicate entries
            const duplicateEntries = [];

            // Check each item for duplicates
            for (const item of data) {
                const existingEntry = await db.ShoppingList.findOne({
                    where: {
                        user_id: userId,
                        food_id: item.food_id,
                        // Use Sequelize's date function to compare only the date part
                        date: db.sequelize.where(
                            db.sequelize.fn('DATE', db.sequelize.col('date')),
                            '=',
                            db.sequelize.fn('DATE', item.date)
                        )
                    }
                });

                if (existingEntry) {
                    // Find the food name for the duplicate entry
                    const food = await db.Food.findByPk(item.food_id);
                    duplicateEntries.push(food ? food.name : `Food ID ${item.food_id}`);
                }
            }

            // If any duplicates found, throw an error with details
            if (duplicateEntries.length > 0) {
                throw new Error(`Duplicate entries found for: ${duplicateEntries.join(', ')}`);
            }

            // If no duplicates, proceed with bulk creation
            const shoppingList = await db.ShoppingList.bulkCreate(data);
            return shoppingList;
        } catch (error) {
            throw new Error(`Error creating shopping list: ${error.message}`);
        }
    }

    async updateShoppingList(id, updateData) {
        try {
            const shoppingList = await db.ShoppingList.findByPk(id);
            if (!shoppingList) {
                throw new Error('Shopping list not found');
            }

            // Update the shopping list entry
            const updatedShoppingList = await shoppingList.update(updateData);
            return updatedShoppingList;
        } catch (error) {
            throw new Error(`Error updating shopping list: ${error.message}`);
        }
    }

    // Delete a shopping list entry
    async deleteShoppingList(id) {
        try {
            const shoppingList = await db.ShoppingList.findByPk(id);
            if (!shoppingList) {
                throw new Error('Shopping list not found');
            }

            await shoppingList.destroy();
            return { message: 'Shopping list deleted successfully' };
        } catch (error) {
            throw new Error(`Error deleting shopping list: ${error.message}`);
        }
    }

    async getShoppingListByUserId(userId, page = 1, limit = 10) {
        try {
            // Calculate offset for pagination
            const offset = (page - 1) * limit;

            // Fetch shopping lists with pagination
            const shoppingLists = await db.ShoppingList.findAndCountAll({
                where: { user_id: userId },
                limit: limit,
                offset: offset,
                order: [['date', 'ASC']],  // Optional: order by date
            });

            // Return the paginated data
            return {
                shoppingLists: shoppingLists.rows,
                totalItems: shoppingLists.count,
                totalPages: Math.ceil(shoppingLists.count / limit),
                currentPage: page,
            };
        } catch (error) {
            throw new Error(`Error fetching shopping list: ${error.message}`);
        }
    }

    async getShoppingListByDate(userId, fromDate, toDate, page = 1, limit = 10) {
        try {
            // Calculate offset for pagination
            const offset = (page - 1) * limit;

            // Use Sequelize's date comparison with only the date part
            const shoppingLists = await db.ShoppingList.findAndCountAll({
                where: {
                    user_id: userId,
                    // Compare only the date part of the datetime
                    date: {
                        [Op.between]: [
                            fromDate,
                            toDate
                        ]
                    }
                },
                limit: limit,
                offset: offset,
                order: [['date', 'ASC']],
                include: [
                    {
                        model: db.Food,
                        as: 'food'
                    }
                ]
            });

            // Return the paginated data
            return {
                shoppingLists: shoppingLists.rows,
                totalItems: shoppingLists.count,
                totalPages: Math.ceil(shoppingLists.count / limit),
                currentPage: page,
            };
        } catch (error) {
            throw new Error(`Error fetching shopping list by date: ${error.message}`);
        }
    }
}

module.exports = new ShoppingListService();