'use strict';
const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'http://coolestimage.com',
      },
      {
        reviewId: 2,
        url: 'http://midimage.com',
      },
      {
        reviewId: 3,
        url: 'http://sussyimage.com',
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
     reviewId: {[Op.in]: [1, 2, 3]}
    }, {})
  }
};
