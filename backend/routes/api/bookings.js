const express = require('express');
const router = express.Router();

const {Spot, SpotImage, Review, ReviewImage, User} = require("../../db/models");
const { Model, json } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { parse } = require('dotenv');


/***************************GET CURRENT USER'S BOOKINGS*****************************/



/***************************GET BOOKINGS BASED ON SPOT ID*****************************/



/***************************CREATE A BOOKING BASED ON SPOT ID*****************************/




/***************************EDIT A BOOKING*****************************/




/***************************DELETE A BOOKING*****************************/



module.exports = router;
