const express = require('express');
const router = express.Router();

const {Spot, SpotImage, Review, ReviewImage, User} = require("../../db/models");
const { Model, json } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { parse } = require('dotenv');


