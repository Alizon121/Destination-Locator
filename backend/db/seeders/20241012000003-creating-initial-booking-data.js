'use strict';
const {Booking} = require('../models')


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await Booking.bulkCreate([
    {
      spotId: 1,
      userId: 1,
      startDate: "03/09/2025",
      endDate: "03/16/2025"
    },
    {
      spotId: 2,
      userId: 2,
      startDate: "10/08/2025",
      endDate: "10/15/2025"
    },
    {
      spotId: 3,
      userId: 3,
      startDate: "04/01/2025",
      endDate: "04/08/2025"
    }
   ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
  options.tableName = "Bookings";
  const Op = Sequelize.Op;
  return queryInterface.bulkDelete(options, {
    startDate: {[Op.in]: ["03/09/2025", "10/08/2025", "04/01/2025"]}
  }, {})
  }
};
