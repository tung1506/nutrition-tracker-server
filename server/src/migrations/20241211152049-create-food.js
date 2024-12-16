'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Food', {
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
      calories: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      protein: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      carbohydrates: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      fats: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      vitamins: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      minerals: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Users', // Assuming the table for User is named 'Users'
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('Food');
  }
};
