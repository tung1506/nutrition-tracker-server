'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch existing meals and foods IDs
    const meals = await queryInterface.sequelize.query(
      'SELECT id FROM Meals',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const foods = await queryInterface.sequelize.query(
      'SELECT id FROM Food',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Validate data exists
    if (meals.length === 0 || foods.length === 0) {
      console.warn('No meals or foods found. Skipping MealFood seeding.');
      return;
    }

    // Generate MealFood data
    const MealFoodData = [];
    const maxEntriesPerMeal = 5; // Max number of foods per meal
    const totalEntries = meals.length * maxEntriesPerMeal;

    console.log(`Preparing to seed ${totalEntries} MealFood entries`);

    // Use standard for loop instead of forEach
    for (let i = 0; i < meals.length; i++) {
      const meal = meals[i];

      // Randomize number of foods for this meal
      const foodCount = faker.number.int({ min: 1, max: maxEntriesPerMeal });

      // Ensure unique food selections for this meal
      const selectedFoods = new Set();
      while (selectedFoods.size < foodCount) {
        const randomFood = faker.helpers.arrayElement(foods);
        selectedFoods.add(randomFood.id);
      }

      // Add foods to the meal
      for (let foodId of selectedFoods) {
        MealFoodData.push({
          meal_id: meal.id,
          food_id: foodId,
          quantity: faker.number.float({
            min: 0.1,
            max: 5,
            precision: 0.1
          }),
          serving_size: faker.helpers.arrayElement([
            'small',
            'medium',
            'large',
            '100g',
            '1 cup',
            '1 slice',
            '50g',
            '200ml'
          ]),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // Batch insert with chunks
    const chunkSize = 1000;
    try {
      for (let i = 0; i < MealFoodData.length; i += chunkSize) {
        const chunk = MealFoodData.slice(i, i + chunkSize);
        await queryInterface.bulkInsert('MealFood', chunk, {
          ignoreDuplicates: true // Prevent duplicate entries
        });

        console.log(`Inserted chunk ${Math.floor(i / chunkSize) + 1}, ${chunk.length} entries`);
      }

      console.log(`Successfully seeded ${MealFoodData.length} MealFood entries`);
    } catch (error) {
      console.error('Error seeding MealFood:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Cleanup method
    await queryInterface.bulkDelete('MealFood', null, {
      truncate: true,
      restartIdentity: true
    });
  }
};