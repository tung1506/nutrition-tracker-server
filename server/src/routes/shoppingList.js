const express = require('express');
const shoppingListController = require('../controllers/shoppingListController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Shopping List
 *   description: Shopping list management operations
 */

/**
 * @swagger
 * /shopping-list:
 *   post:
 *     tags:
 *       - Shopping List
 *     summary: Create a new shopping list
 *     description: Allows a user to create multiple shopping list entries
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 food_id:
 *                   type: integer
 *                   example: 1
 *                 quantity:
 *                   type: number
 *                   example: 2.5
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2024-01-15"
 *                 is_bought:
 *                   type: boolean
 *                   example: false
 *                 note:
 *                   type: string
 *                   example: "Buy organic if possible"
 *     responses:
 *       201:
 *         description: Shopping list entries created successfully
 *       400:
 *         description: Error creating shopping list
 */
router.post('/', shoppingListController.createShoppingList);

/**
 * @swagger
 * /shopping-list/{id}:
 *   put:
 *     tags:
 *       - Shopping List
 *     summary: Update a shopping list entry
 *     description: Update details of an existing shopping list entry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the shopping list entry to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 3
 *               is_bought:
 *                 type: boolean
 *                 example: true
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               note:
 *                 type: string
 *                 example: "Updated shopping list item"
 *     responses:
 *       200:
 *         description: Shopping list entry updated successfully
 *       400:
 *         description: Error updating shopping list
 */
router.put('/:id', shoppingListController.updateShoppingList);

/**
 * @swagger
 * /shopping-list/{id}:
 *   delete:
 *     tags:
 *       - Shopping List
 *     summary: Delete a shopping list entry
 *     description: Remove a specific shopping list entry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the shopping list entry to delete
 *     responses:
 *       200:
 *         description: Shopping list entry deleted successfully
 *       400:
 *         description: Error deleting shopping list
 */
router.delete('/:id', shoppingListController.deleteShoppingList);

/**
 * @swagger
 * /shopping-list:
 *   get:
 *     tags:
 *       - Shopping List
 *     summary: Get shopping list for the current user
 *     description: Retrieve paginated shopping list entries for the current user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved shopping list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shoppingLists:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       food_id:
 *                         type: integer
 *                       quantity:
 *                         type: number
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       is_bought:
 *                         type: boolean
 *                       note:
 *                         type: string
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       400:
 *         description: Error retrieving shopping list
 */
router.get('/', shoppingListController.getShoppingList);

/**
 * @swagger
 * /shopping-list/by-date:
 *   get:
 *     tags:
 *       - Shopping List
 *     summary: Get shopping list by date range
 *     description: Retrieve shopping list items for the current user within a specific date range
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved shopping list by date
 *       400:
 *         description: Error retrieving shopping list
 */
router.get('/by-date', shoppingListController.getShoppingListByDate);

module.exports = router;
