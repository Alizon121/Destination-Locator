const express = require('express');
const router = express.Router();

const {Spot, SpotImage, Review, ReviewImage, User, Booking} = require("../../db/models");
const { Model, json } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { parse } = require('dotenv');


/***************************GET CURRENT USER'S BOOKINGS*****************************/
router.get('/current', requireAuth, async (req, res, next) => {
    try {
        const currentId = req.user.id;
        const bookings = await Booking.findAll({
            where: { userId: currentId},
            include: {
                model: Spot,
                as: 'Spot',
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: {
                    model: SpotImage,
                    attributes: ['url'],
                    where: { preview: true },
                    required: false
                }
            }
        })

        const newFormat = bookings.map(booking => ({
            id: booking.id,
            spotId: booking.spotId,
            Spot: {
                ...booking.Spot.get(), //get() Sequelize method retrieves values of model as plain JS object
                previewImage: booking.Spot.SpotImages.length > 0 ? booking.Spot.SpotImages[0].url : null
            },
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
    }));

    res.json({Bookings: newFormat})

    } catch (error) {
        next(error);
    }

});


/***************************GET BOOKINGS BASED ON SPOT ID*****************************/



/***************************CREATE A BOOKING BASED ON SPOT ID*****************************/




/***************************EDIT A BOOKING*****************************/




/***************************DELETE A BOOKING*****************************/



module.exports = router;
