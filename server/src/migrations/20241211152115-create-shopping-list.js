'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ShoppingLists', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Users', // Name of the referenced table (case-sensitive)
          key: 'id', // The field in the referenced table to link
        },
        onDelete: 'CASCADE', // If the user is deleted, the shopping list will also be deleted
      },
      food_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Food', // Name of the referenced table (case-sensitive)
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE, // Storing the date as a string (dd/mm/yyyy format)
        allowNull: false,
      },
      is_bought: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      note: {
        type: Sequelize.STRING,
        allowNull: true, // Optional field for additional information
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Automatically set the creation date
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Automatically set the update date
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ShoppingLists');
  }
};
