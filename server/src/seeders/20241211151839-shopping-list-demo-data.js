'use strict';

const { faker } = require('@faker-js/faker'); // Using faker for generating fake data

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate 50-100 shopping list records
    const shoppingListData = [];

    for (let i = 0; i < 5000; i++) {
      shoppingListData.push({
        user_id: faker.number.int({ min: 1, max: 1000 }), // Assuming 50 users exist
        food_id: faker.number.int({ min: 1, max: 3999 }), // Assuming 100 food items exist
        quantity: faker.number.float({ min: 0.1, max: 10, precision: 0.1 }), // Random quantity
        date: faker.date.past(1), // Random date within the past year
        is_bought: faker.datatype.boolean(), // Random boolean for is_bought
        note: faker.lorem.sentence(), // Optional note
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert the generated data into the ShoppingLists table
    await queryInterface.bulkInsert('ShoppingLists', shoppingListData, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Optionally, delete the seeded data
    await queryInterface.bulkDelete('ShoppingLists', null, {});
  }
};
