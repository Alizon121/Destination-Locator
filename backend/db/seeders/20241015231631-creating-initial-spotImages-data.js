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
        url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyaminmellish-186077.jpg&fm=jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyaminmellish-186077.jpg&fm=jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        preview: true
      },
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
     spotId: {[Op.in]: [1, 2, 3, 4, 5, 6, 7]}
    }, {})
  }
};
