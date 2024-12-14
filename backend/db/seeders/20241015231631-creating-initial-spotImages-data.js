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
        spotId: 1,
        url: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyaminmellish-186077.jpg&fm=jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyaminmellish-186077.jpg&fm=jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyaminmellish-186077.jpg&fm=jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyaminmellish-186077.jpg&fm=jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg',
        preview: true
      },
      {
        spotId: 4,
        url: "https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg",
        preview: false
      },
      {
        spotId: 4,
        url: "https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg",
        preview: false
      },
      {
        spotId: 4,
        url: "https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg",
        preview: false
      },
      {
        spotId: 4,
        url: "https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg",
        preview: false
      },
      {
        spotId: 5,
        url: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://images.pexels.com/photos/2121120/pexels-photo-2121120.jpeg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://images.pexels.com/photos/2121120/pexels-photo-2121120.jpeg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://images.pexels.com/photos/2121120/pexels-photo-2121120.jpeg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://images.pexels.com/photos/2121120/pexels-photo-2121120.jpeg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://images.pexels.com/photos/262405/pexels-photo-262405.jpeg',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg',
        preview: false
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
