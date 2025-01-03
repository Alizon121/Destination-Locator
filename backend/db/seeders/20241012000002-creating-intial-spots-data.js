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
      name: "Cabin on Beale St",
      price: 68.00,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      ownerId: 2,
      address: "2331 Cathedral Dr",
      city: "Minneapolis",
      state: "MN",
      country: "United States of America",
      lat: 89.1010190,
      lng: -108.1018829,
      name: "Condo in metro area",
      price: 152.00,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      ownerId: 3,
      address: "1991 Washington Ave",
      city: "Las Vegas",
      state: "NV",
      country: "United States of America",
      lat: 70.1241249,
      lng: -101.1191904,
      name: "Condo on the Strip",
      price: 128.00,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      ownerId: 3,
      address: "1818 Miners Ave",
      city: "Chicago",
      state: "IL",
      country: "United States of America",
      lat: 30.1241249,
      lng: -100.1191904,
      name: "Apartment in loop",
      price: 128.00,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
    },
    {
      ownerId: 2,
      address: "425 Western Ave",
      city: "Monaco",
      state: "AL",
      country: "United States of America",
      lat: 40.1241249,
      lng: -90.1191904,
      name: "House on Prarie",
      price: 128.00,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
    },
    {
      ownerId: 2,
      address: "987 New Almond Ave",
      city: "Lebanon",
      state: "GA",
      country: "United States of America",
      lat: 20.1241249,
      lng: -90.1191904,
      name: "Quiet barn",
      price: 128.00,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
    },
    {
      ownerId: 1,
      address: "101 Hane Ave",
      city: "Lander",
      state: "MN",
      country: "United States of America",
      lat: 80.1241249,
      lng: -90.1191904,
      name: "Treehouse in the woods",
      price: 128.00,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
    },
   ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      lat: {[Op.in]: [28.0825000, 89.1010190, 70.1241249, 30.1241249, 40.1241249, 20.1241249, 80.1241249]}
    }, {})
  }
};
