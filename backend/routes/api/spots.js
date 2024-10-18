const express = require('express');
const router = express.Router();
// const apiRouter = require('./api');
const {Spot, SpotImage, Review} = require("../../db/models");
const { Model } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
// router.use('/api', apiRouter);

function getAverage(arr) {
    if (arr.length === 0) {
      return null; // Return 0 if the array is empty to avoid division by zero
    }
    const sum = arr.reduce((acc, val) => acc + val, 0);
    const average = sum / arr.length;
    return Number.parseFloat(average).toFixed(1);
  }

  router.get("/", async (req,res,next) => {
      try {
            const spots = await Spot.findAll({
            include: [
                { model: SpotImage, attributes: ['url'] },
                { model: Review, attributes: ['stars'] }]
        })

        const newFormat = spots.map(spotElements => {
            const reviews = spotElements.Reviews;
            const spotRatings = reviews.map(reviewStars => reviewStars.stars);
            const avgRating = getAverage(spotRatings);

            const spotImagesDetails = spotElements.dataValues.SpotImages;
            const url = spotImagesDetails.map(element => element.dataValues.url);

            return {
                id: spotElements.id,
                ownerId: spotElements.ownerId,
                address: spotElements.address,
                city: spotElements.city,
                state: spotElements.state,
                country: spotElements.country,
                lat: spotElements.lat,
                lng: spotElements.lng,
                name: spotElements.name,
                description: spotElements.description,
                price: spotElements.price,
                createdAt: spotElements.createdAt,
                updatedAt: spotElements.updatedAt,
                previewImage: url,
                avgRating: avgRating
            }
        });

    return res.json({
        // spots
        Spots: newFormat
    })
} catch(error) {
    next(error)
}
})


router.post("/", requireAuth, async (req,res,next) => {
    console.log(req.body)
    const { ownerId, address, city, state, country, lat, lng, name, price, description} = req.body
    const existingListing = await Spot.findOne({where:{lat}})
    try {
        if (!existingListing) {
            const newSpot = await Spot.create({
                ownerId,
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                price,
                description,
            })
            res.json(newSpot)
        } else (
            res.status(400).json("Listing already exists.")
        )
    } catch(error) {
        next(error)
    }
})

router.get('/:current', requireAuth, async (req, res, next) => {
    const currentId = req.params.current;
    const spots = await Spot.findAll({
        where: { ownerId: currentId},
        include:
        [
            { model: SpotImage, attributes: ['url'] },
            { model: Review, attributes: ['stars'] }
        ]
    })


    const newFormat = spots.map(spotElements => {

        const reviews = spotElements.Reviews;
        const spotRatings = reviews.map(reviewStars => reviewStars.stars);
        const avgRating = getAverage(spotRatings);

        const spotImagesDetails = spotElements.SpotImages;
        const urls = spotImagesDetails.map(element => element.dataValues.url)


        return {
            id: spotElements.id,
            ownerId: spotElements.ownerId,
            address: spotElements.address,
            city: spotElements.city,
            state: spotElements.state,
            country: spotElements.country,
            lat: spotElements.lat,
            lng: spotElements.lng,
            name: spotElements.name,
            description: spotElements.description,
            price: spotElements.price,
            createdAt: spotElements.createdAt,
            updatedAt: spotElements.updatedAt,
            avgRating: avgRating,
            previewImage: urls
        }
    })

    res.json(newFormat);
})


module.exports = router;
