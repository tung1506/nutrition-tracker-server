const express = require('express');
const MealController = require('../controllers/mealController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Meals
 *   description: Meal management operations
 */

/**
 * @swagger
 * /meals/create:
 *   post:
 *     tags:
 *       - Meals
 *     summary: Create a new meal
 *     description: Allows a user to create a new meal with food items including their nutritional information.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - meal_type
 *               - date
 *               - foods
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the meal
 *                 example: "Healthy Breakfast"
 *               meal_type:
 *                 type: string
 *                 description: Type of meal
 *                 enum: 
 *                   - breakfast
 *                   - lunch
 *                   - dinner
 *                   - snack
 *                 example: "breakfast"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the meal
 *                 example: "2024-01-15"
 *               foods:
 *                 type: array
 *                 description: List of food items in the meal
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID of the food item
 *                       example: 1
 *                     name:
 *                       type: string
 *                       description: Name of the food
 *                       example: "Sleek Cotton Gloves"
 *                     calories:
 *                       type: number
 *                       description: Calories in the food
 *                       example: 84
 *                     protein:
 *                       type: number
 *                       description: Protein content in the food
 *                       example: 16
 *                     carbohydrates:
 *                       type: number
 *                       description: Carbohydrates content in the food
 *                       example: 27
 *                     fats:
 *                       type: number
 *                       description: Fats content in the food
 *                       example: 1
 *                     vitamins:
 *                       type: number
 *                       description: Vitamins content in the food
 *                       example: 10
 *                     minerals:
 *                       type: number
 *                       description: Minerals content in the food
 *                       example: 3
 *                     quantity:
 *                       type: number
 *                       description: Quantity of the food item
 *                       example: 1
 *                     serving_size:
 *                       type: string
 *                       description: Serving size of the food item
 *                       example: "100ml"
 *     responses:
 *       201:
 *         description: Meal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique identifier of the created meal
 *                 name:
 *                   type: string
 *                   description: Name of the meal
 *                 meal_type:
 *                   type: string
 *                   description: Type of meal
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   description: Date and time of the meal
 *                 total_calories:
 *                   type: number
 *                   description: Total calories in the meal
 *                 total_protein:
 *                   type: number
 *                   description: Total protein in the meal
 *                 total_carbohydrates:
 *                   type: number
 *                   description: Total carbohydrates in the meal
 *                 total_fats:
 *                   type: number
 *                   description: Total fats in the meal
 *                 foods:
 *                   type: array
 *                   description: List of foods in the meal
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Food item ID
 *                       name:
 *                         type: string
 *                         description: Name of the food
 *                       calories:
 *                         type: number
 *                         description: Calories in the food
 *                       MealFood:
 *                         type: object
 *                         properties:
 *                           quantity:
 *                             type: number
 *                             description: Quantity of the food in the meal
 *       400:
 *         description: Error creating meal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Invalid input data"
 */
router.post('/create', MealController.createMeal);

/**
 * @swagger
 * /meals:
 *   get:
 *     tags:
 *       - Meals
 *     summary: Get meals for the current user
 *     description: Retrieve paginated meals for the current user
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
 *       - in: query
 *         name: meal_type
 *         schema:
 *           type: string
 *           enum: ['breakfast', 'lunch', 'dinner', 'snack']
 *         description: Filter by meal type
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering meals
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering meals
 *     responses:
 *       200:
 *         description: Successfully retrieved meals
 *       400:
 *         description: Error retrieving meals
 */
router.get('/', MealController.getMeals);

/**
 * @swagger
 * /meals/update-info/{mealId}:
 *   post:
 *     tags:
 *       - Meals
 *     summary: Update meal information
 *     description: Update the meal information for a specific meal ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: mealId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the meal to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - meal_type
 *               - date
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the meal
 *                 example: "Healthy Breakfast"
 *               meal_type:
 *                 type: string
 *                 enum:
 *                   - breakfast
 *                   - lunch
 *                   - dinner
 *                   - snack
 *                 description: Type of meal
 *                 example: "breakfast"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the meal
 *                 example: "2024-12-19"
 *     responses:
 *       200:
 *         description: Meal information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique identifier of the updated meal
 *                 name:
 *                   type: string
 *                   description: Name of the meal
 *                 meal_type:
 *                   type: string
 *                   description: Type of meal
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: Date of the meal
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *       404:
 *         description: Meal not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Meal not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 *
 * /meals/update-food/{mealId}:
 *   post:
 *     tags:
 *       - Meals
 *     summary: Update food items in a meal
 *     description: Update the food items for a specific meal ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: mealId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the meal to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - foods
 *             properties:
 *               foods:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     food_id:
 *                       type: integer
 *                       description: ID of the food item
 *                     quantity:
 *                       type: number
 *                       description: New quantity of the food item
 *     responses:
 *       200:
 *         description: Food items updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Food items updated successfully"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid meal ID or food data"
 *       404:
 *         description: Meal not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Meal not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */

router.post('/update-info/:mealId', MealController.updateMealInfo);
router.post('/update-food/:mealId', MealController.updateMealFood);


/**
 * @swagger
 * /meals/delete/{mealId}:
 *   delete:
 *     tags:
 *       - Meals
 *     summary: Delete a meal
 *     description: Delete a specific meal by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mealId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the meal to delete
 *     responses:
 *       200:
 *         description: Meal deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Meal deleted successfully"
 *                 mealId:
 *                   type: integer
 *                   description: ID of the deleted meal
 *       400:
 *         description: Error deleting meal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Meal not found or you are not authorized to delete this meal"
 */
router.delete('/delete/:mealId', MealController.deleteMeal);

module.exports = router;
