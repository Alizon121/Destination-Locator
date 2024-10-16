'use strict';
const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'http://coolspotsbro.com',
        preview: true
      },
      {
        spotId: 2,
        url: 'http://coolestspoteverrr.com',
        preview: false
      },
      {
        spotId: 3,
        url: 'http://yeahsomething.com',
        preview: true
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
     spotId: {[Op.in]: [1, 2, 3]}
    }, {})
  }
};
