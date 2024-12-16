'use strict';

const { faker } = require('@faker-js/faker'); // Correct import for @faker-js/faker

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate 50-100 food records
    const foodData = [];

    for (let i = 0; i < 4000; i++) {
      foodData.push({
        name: faker.commerce.productName(), // Correct usage of productName
        calories: faker.number.int({ min: 50, max: 500 }), // Use faker.number.int instead of faker.datatype.number
        protein: faker.number.int({ min: 5, max: 50 }), // Correct method for generating integers
        carbohydrates: faker.number.int({ min: 10, max: 100 }),
        fats: faker.number.int({ min: 1, max: 30 }),
        vitamins: faker.number.int({ min: 0, max: 10 }),
        minerals: faker.number.int({ min: 0, max: 10 }),
        user_id: faker.number.int({ min: 1, max: 50 }), // Assuming you have 50 users
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert the generated data into the Food table
    await queryInterface.bulkInsert('Food', foodData, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Optionally add logic to delete the seeded data
    await queryInterface.bulkDelete('Food', null, {});
  }
};
