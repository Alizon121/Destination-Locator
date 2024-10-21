'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = "Users";
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        email: 'demo@user.io',
        firstName: 'Andrew',
        lastName: 'Lizon'
      },
      {
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
        email: 'user1@user.io',
        firstName: "Erika",
        lastName: "Brandon"
      },
      {
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        email: 'user2@user.io',
        firstName: "Raihan",
        lastName: "Hasan"
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
