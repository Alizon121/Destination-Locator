'use strict';
const { query } = require("express");
const {Review} = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await Review.bulkCreate([
    {
      spotId: 1,
      userId: 1,
      review: "Location has great hopsitality.",
      stars: 4
    },
    {
      spotId: 2,
      userId: 2,
      review: "The stay was not clean and had loud neighbors.",
      stars: 2
    },
    {
      spotId: 3,
      userId: 3,
      review: "All around great, I will be coming back!",
      stars: 5
    }
   ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
   options.tableName = "Reviews";
   const Op = Sequelize.Op;
   return queryInterface.bulkDelete(options, {
    stars: {[Op.in]: [4, 2, 5]}
   }, {})
  }
};
