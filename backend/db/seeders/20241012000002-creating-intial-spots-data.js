'use strict';
const { query } = require("express");
const {Spot} = require("../models");
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await Spot.bulkCreate([
    {
      ownerId: 1,
      address: "4858 Elmhurst Ave",
      city: "Memphis",
      state: "TN",
      country: "United States of America",
      lat: 28.0825000,
      lng: -155.2457809,
      name: "Country Cabin Near Beale St",
      price: 68.00,
      description: "A cute wooden cabin near Beale St."
    },
    {
      ownerId: 2,
      address: "2331 Cathedral Dr",
      city: "Minneapolis",
      state: "MN",
      country: "United States of America",
      lat: 95.1010190,
      lng: -108.1018829,
      name: "High rise near metropolitan area",
      price: 152.00,
      description: "High rise near the Arts District."
    },
    {
      ownerId: 3,
      address: "1991 Washington Ave",
      city: "Las Vegas",
      state: "NV",
      country: "United States of America",
      lat: 100.1241249,
      lng: -101.1191904,
      name: "Condo near the Strip",
      price: 128.00,
      description: "Lively night life and clean stay."
    }
   ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      lat: {[Op.in]: [28.0825000, 95.1010190, 100.1241249]}
    }, {})
  }
};
