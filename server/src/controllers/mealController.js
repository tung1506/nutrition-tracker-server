const MealService = require('../services/mealService');
const { Op } = require('sequelize');

const MealController = {
    async createMeal(req, res) {
        try {
            const newMeal = await MealService.createMeal(req.body, req.userId);
            res.status(201).json(newMeal);
        } catch (error) {
            res.status(400).json({
                message: error.message,
                error: error
            });
        }
    },

    async getMeals(req, res) {
        try {
            // Get user ID from the authenticated request
            const userId = req.userId;

            // Extract query parameters
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const meal_type = req.query.meal_type;
            const from_date = req.query.from_date;
            const to_date = req.query.to_date;

            // Get meals using service
            const result = await MealService.getMealsByUser(
                userId,
                meal_type,
                from_date,
                to_date,
                page,
                limit
            );

            // Return paginated meals
            res.status(200).json({
                meals: result.meals,
                totalItems: result.totalItems,
                totalPages: result.totalPages,
                currentPage: result.currentPage
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    },

    async updateMealInfo(req, res) {
        const { mealId } = req.params; // Lấy mealId từ query
        const userId = req.userId; // Lấy userId từ middleware
        const updateData = req.body; // Lấy dữ liệu cập nhật từ body

        try {
            const updatedMeal = await MealService.updateMealInfo(mealId, userId, updateData);
            res.status(200).json(updatedMeal);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Cập nhật thực phẩm trong bữa ăn
    async updateMealFood(req, res) {
        const { mealId } = req.params; // Lấy mealId từ query
        const userId = req.userId; // Lấy userId từ middleware
        const updateData = req.body; // Lấy dữ liệu cập nhật từ body

        try {
            const updatedMeal = await MealService.updateMealFood(mealId, userId, updateData);
            res.status(200).json(updatedMeal);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteMeal(req, res) {
        try {
            const { mealId } = req.params;
            const userId = req.userId;

            const result = await MealService.deleteMeal(mealId, userId);

            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = MealController;