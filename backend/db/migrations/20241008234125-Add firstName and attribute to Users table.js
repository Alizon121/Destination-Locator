'use strict';

let options = {};

if (process.env.NODE_ENV === 'production') {
options.schema = process.env.SCHEMA;
}

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   options.tableName = "Users"
   await queryInterface.addColumn(options, "firstName",{
    type: Sequelize.STRING,
   })
  },

  async down (queryInterface, _Sequelize) {
    options.tableName = "Users"
    await queryInterface.dropTable(options, "firstName");
  }
};
