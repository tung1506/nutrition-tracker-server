'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const mealData = [];
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

    // Fetch existing foods to use in meal creation
    const foods = await queryInterface.sequelize.query(
      'SELECT id FROM Food',
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (let i = 0; i < 1000; i++) {
      // Prepare meal data
      const mealCreateData = {
        name: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        user_id: faker.number.int({ min: 1, max: 1000 }), // Assuming 1000 users
        meal_type: faker.helpers.arrayElement(mealTypes),
        date: faker.date.past(1), // Random date within the past year
        total_calories: 0, // Will be calculated later
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mealData.push(mealCreateData);
    }

    // Insert the generated data into the Meals table
    await queryInterface.bulkInsert('Meals', mealData, {});

    // Now create MealFood associations
    const meals = await queryInterface.sequelize.query(
      'SELECT id FROM Meals',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const MealFoodData = [];
    const maxFoodsPerMeal = 5;

    for (let meal of meals) {
      // Randomize number of foods for this meal
      const foodCount = faker.number.int({ min: 1, max: maxFoodsPerMeal });

      // Ensure unique food selections
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
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // Batch insert MealFood
    const chunkSize = 1000;
    for (let i = 0; i < MealFoodData.length; i += chunkSize) {
      const chunk = MealFoodData.slice(i, i + chunkSize);
      await queryInterface.bulkInsert('MealFood', chunk, {
        ignoreDuplicates: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Optionally delete the seeded data
    await queryInterface.bulkDelete('Meals', null, {});
    await queryInterface.bulkDelete('MealFood', null, {});
  }
};