'use strict';

let options = {};
options.tableName = 'Users'
if (process.env.NODE_ENV === 'production') {
options.schema = process.env.SCHEMA;
}

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

   await queryInterface.addColumn(options, "firstName",{
    type: Sequelize.STRING,
    allowNull: true
   }, options)
  },

  async down (queryInterface, _Sequelize) {
    await queryInterface.dropTable(options);
  }
};
