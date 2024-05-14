'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Todos',
      'isComplete',
      {
        type: Sequelize.BOOLEAN,
        default: false,
        allowNull: false
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Todos',
      'isComplete',
    )
  }
};
