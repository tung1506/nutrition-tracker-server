'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ShoppingList extends Model {
        static associate(models) {
            ShoppingList.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });

            ShoppingList.belongsTo(models.Food, {
                foreignKey: 'food_id',
                as: 'food'
            });
        }
    }

    ShoppingList.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            food_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            is_bought: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            note: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: 'ShoppingList',
            timestamps: true,
        }
    );

    return ShoppingList;
};
