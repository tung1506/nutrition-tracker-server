'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Meals', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      meal_type: {
        type: Sequelize.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
        allowNull: false
      },
      total_calories: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      total_protein: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      total_carbohydrates: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      total_fats: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      total_vitamins: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      total_minerals: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Meals');
  }
};