'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MealFood extends Model {
        static associate(models) {
            // Association with Meal
            MealFood.belongsTo(models.Meal, {
                foreignKey: 'meal_id',
                as: 'meal'
            });

            // Association with Food
            MealFood.belongsTo(models.Food, {
                foreignKey: 'food_id',
                as: 'food'
            });
        }
    }

    MealFood.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            meal_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Meal ID is required'
                    }
                }
            },
            food_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Food ID is required'
                    }
                }
            },
            quantity: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 1,
                validate: {
                    min: {
                        args: [0],
                        msg: 'Quantity must be a positive number'
                    }
                }
            },
            serving_size: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 100],
                        msg: 'Serving size must be less than 100 characters'
                    }
                }
            }
        },
        {
            sequelize,
            modelName: 'MealFood',
            tableName: 'MealFood', // Ensure this matches the table name in migration
            timestamps: true
        }
    );

    return MealFood;
};