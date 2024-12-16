'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Meal extends Model {
        static associate(models) {
            // Association with User
            Meal.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });

            // Many-to-Many association with Food through MealFood
            Meal.belongsToMany(models.Food, {
                through: 'MealFood', // Name of the junction table
                foreignKey: 'meal_id', // Foreign key in the junction table referencing Meal
                otherKey: 'food_id',   // Foreign key in the junction table referencing Food
                as: 'foods'            // Alias for the association
            });
        }
    }

    Meal.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            meal_type: {
                type: DataTypes.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
                allowNull: false,
                validate: {
                    isIn: [['breakfast', 'lunch', 'dinner', 'snack']]
                }
            },
            total_calories: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            total_protein: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            total_carbohydrates: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            total_fats: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            total_vitamins: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            total_minerals: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            user_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'Meal',
            timestamps: true
        }
    );

    return Meal;
};