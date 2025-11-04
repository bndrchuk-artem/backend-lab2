'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Currencies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING(3),
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    // Додаємо початкові дані
    await queryInterface.bulkInsert('Currencies', [
      { code: 'UAH', name: 'Ukrainian Hryvnia' },
      { code: 'USD', name: 'US Dollar' },
      { code: 'EUR', name: 'Euro' }
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Currencies');
  }
};