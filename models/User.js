'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Юзер має валюту за замовчуванням
      User.belongsTo(models.Currency, {
        foreignKey: 'default_currency_id',
        as: 'defaultCurrency'
      });
      
      // Юзер має багато записів
      User.hasMany(models.Record, {
        foreignKey: 'user_id'
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
    // 'default_currency_id' буде додано міграцією
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true
  });
  return User;
};