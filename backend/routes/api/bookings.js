const express = require('express');
const router = express.Router();

const {Spot, SpotImage, Review, ReviewImage, User, Booking} = require("../../db/models");
const { requireAuth } = require('../../utils/auth');
const { where } = require('sequelize');
const { format } = require('sequelize/lib/utils');

/*************Get Booking of Current User *******************/
router.get('/current', requireAuth, async (req, res, next) => {
    const currentId = req.user.dataValues.id;
    
    try {
    // Query for getting all bookings of current user
    const bookings = await Booking.findAll({
        where: {userId: currentId},
        include: [
            {model: Spot}
        ]
    })
    
    // Query for finding 
    const allSpotImages = await SpotImage.findAll({
            where: {spotId: bookings.map((item) => item.spotId)[0]}
        })
        // Method for getting the url for the previewImage
        const spotImages = allSpotImages.map((data) => data.dataValues.url)
        
        // Array method for finding the booking spotId
        const info = bookings.map((item) => {
        console.log(item.dataValues.startDate)
        const spotId = item.spotId
        item.Spot.dataValues.previewImage=spotImages[0]
        
        return {
            id: item.id,
            spotId: item.spotId,
            Spot: item.Spot,
            userId: currentId,
            startDate: item.dataValues.startDate,
            endDate: item.dataValues.endDate,
            createdAt: item.dataValues.createdAt,
            updatedAt: item.dataValues.updatedAt
        }
    })
        return res.json({
            Bookings: info
        } )
    } catch(error) {
        next(error)
    }
})

/*********************Edit a Booking ********************/
router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const userId = req.user.dataValues.id;
    const {startDate, endDate} = req.body;
    
    const booking = await Booking.findByPk(bookingId)
    // Booking does not exist
    if (!booking) res.status(404).json({message: "Booking couldnt' be found"})
    
    // Authorization: booking must belong to user
    if (booking.dataValues.userId !== userId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }
    
    // Past booking validation
    const endDateData = booking.dataValues.endDate
    const endDateyear = endDateData.getUTCFullYear()
    const endDateMonth = (endDateData.getUTCMonth()+1).toString().padStart(2, '0')
    const endDateDay = (endDateData.getUTCDate()).toString().padStart(2, '0')
    const endDateFormat = `${endDateyear}-${endDateMonth}-${endDateDay}`
    if (Date.parse(endDateFormat) < Date.now()) return res.status(403).json({
        message: "Past bookings can't be modified"
    }) 

    // Booking exists validation
    const validationExists = {};
    const startDateData = booking.dataValues.startDate
    const startDateYear = startDateData.getUTCFullYear()
    const startDateMonth = (startDateData.getUTCMonth()+1).toString().padStart(2, '0')
    const startDateDay = (startDateData.getUTCDate()).toString().padStart(2, '0')
    const startDateFormat = `${startDateYear}-${startDateMonth}-${startDateDay}`

    if (startDateFormat === startDate) validationExists.startDate = "Start date conflicts with an exisiting booking"
    if (endDateFormat === endDate) validationExists.endDate = "End date conflicts with an existing booking"
    if (Object.keys(validationExists).length > 0) return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: validationExists
    })

    // Body Validation Error
    const errors = {}
    if (Date.parse(startDate) < Date.now() ) {
        errors.startDate = "startDate cannot be in the past"
    } if (Date.parse(endDate) <= Date.parse(startDate)) {
        errors.endDate = "endDate cannot be on or before the startDate"
    }
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors: errors
        })
    }

    booking.set({
        startDate,
        endDate
    })

    await booking.save()
    res.json(booking)

})
    /****************Delete a Booking ******************/
    router.delete('/:bookingId', requireAuth, async (req, res, next) => {

        const userId = req.user.dataValues.id;
        const bookingId = req.params.bookingId;
        const booking = await Booking.findByPk(bookingId)

        // Authorization -> booking should be current user's booking
        if (userId !== booking.dataValues.userId) return res.status(403).json({
            message: "Forbidden"
        })
        
        // Booking with specified id does not exist
        if (!booking) return res.status(404).json({message: "booking couldn't be found"})

        // Booking that has been started can't be deleted
        // The current date cannot be between the start and endate
        const currentDate = new Date(Date.now()).toLocaleDateString()
        const currentDateSplit = currentDate.split('/');
        const currentDateSplitYear = currentDateSplit[2];
        const currentDateSplitMonth = currentDateSplit[0];
        const currentDateSplitDay = currentDateSplit[1];
        const formattedCurrentDate = `${currentDateSplitYear}-${currentDateSplitMonth}-${currentDateSplitDay}`

        const startDateInfo = booking.dataValues.startDate
        const startDateYear = startDateInfo.getUTCFullYear()
        const startDateMonth = (startDateInfo.getUTCMonth()+1).toString().padStart(2, '0')
        const startDateDay = (startDateInfo.getUTCDate()).toString().padStart(2, '0')
        const formattedStartDate = `${startDateYear}-${startDateMonth}-${startDateDay}`

        const endDateInfo = booking.dataValues.endDate
        const endDateYear = endDateInfo.getUTCFullYear()
        const endDateMonth = (endDateInfo.getUTCMonth()+1).toString().padStart(2, '0')
        const endDateDay = (endDateInfo.getUTCDate()).toString().padStart(2, '0')
        const formattedEndDate = `${endDateYear}-${endDateMonth}-${endDateDay}`
        if (Date.parse(formattedStartDate) < Date.parse(formattedCurrentDate) && Date.parse(formattedEndDate) > Date.parse(formattedCurrentDate)) {
            res.status(403).json({
                message: "Bookings that have been started can't be deleted"
            })
        }

        await booking.destroy();
        res.json({message: "Successfully deleted"})

    })




module.exports = router;