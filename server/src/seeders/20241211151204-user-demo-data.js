const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];

    const numberOfRecords = faker.number.int({ min: 1000, max: 2000 }); // Randomize number of records between 50-100

    for (let i = 0; i < numberOfRecords; i++) {
      users.push({
        username: faker.internet.userName(),
        password: faker.internet.password(),
        session: faker.string.uuid(),
        group_ids: faker.helpers.arrayElement([null, '1,2', '3,4', '5']),
        name: faker.person.fullName(), // Generates a random full name (first + last)
        phone: faker.phone.number(),
        age: faker.number.int({ min: 18, max: 65 }),
        weight: faker.number.float({ min: 50, max: 100, precision: 0.1 }),
        height: faker.number.float({ min: 140, max: 200, precision: 0.1 }),
        role: faker.number.int({ min: 1, max: 5 }),
        meal_plan_ids: faker.helpers.arrayElement([null, '1', '2,3', '4,5']),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
