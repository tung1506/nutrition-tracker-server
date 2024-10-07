'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {

    }
  };

  User.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    session: {
      type: DataTypes.STRING,
    },
    group_ids: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    weight: {
      type: DataTypes.INTEGER,
    },
    height: {
      type: DataTypes.FLOAT(53),
    },
    role: {
      type: DataTypes.BIGINT,
    },
    meal_plan_ids: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false,
  });

  return User;
};