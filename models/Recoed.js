// models/Record.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    static associate(models) {
      // Запис належить Юзеру
      Record.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
      // Запис належить Категорії
      Record.belongsTo(models.Category, {
        foreignKey: 'category_id'
      });
      // Запис має Валюту
      Record.belongsTo(models.Currency, {
        foreignKey: 'currency_id'
      });
    }
  }
  Record.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
    // user_id, category_id, currency_id будуть додані міграцією
    // created_at буде додано автоматично (timestamps: true)
  }, {
    sequelize,
    modelName: 'Record',
    timestamps: true,
    updatedAt: false
  });
  return Record;
};