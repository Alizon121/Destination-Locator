const express = require('express');
const router = express.Router();
// const apiRouter = require('./api');
const {Spot, SpotImage, Review, User} = require("../../db/models");
const { Model, json } = require('sequelize');
const { requireAuth, requireAuthorization } = require('../../utils/auth');
// router.use('/api', apiRouter);

function getAverage(arr) {
    if (arr.length === 0) {
      return null; // Return 0 if the array is empty to avoid division by zero
    }
    const sum = arr.reduce((acc, val) => acc + val, 0);
    const average = sum / arr.length;
    return Number.parseFloat(average).toFixed(1);
  }

  function countReviews(arr) {
    let count = 0
    let i = 0;

    while (i < arr.length) {
        i++;
        count++;
    }
    return count;
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
                previewImage: url[0],
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
            res.status(201).json(newSpot)
        } else (
            res.status(400).json("Listing already exists.")
        )
    } catch(error) {
        next(error)
    }
})

router.get('/current', requireAuth, async (req, res, next) => {
    const currentId = req.user.dataValues.id
    const spots = await Spot.findAll({
        where: { ownerId: currentId},
        include: [
            { model: SpotImage, attributes: ['url'] },
            { model: Review, attributes: ['stars'] }
        ]
    })

    const newFormat = spots.map(spotElements => {
        const reviews = spotElements.Reviews;
        const spotRatings = reviews.map(reviewStars => reviewStars.stars);
        const avgRating = getAverage(spotRatings);

        const spotImagesDetails = spotElements.SpotImages;
        const url = spotImagesDetails.map(element => element.dataValues.url)

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
            previewImage: url[0]
        }
    })

    res.json(newFormat);
})

router.get('/:spotId', async (req, res, next) => {
    const spotId = req.params.spotId;

    try {
        if (!await Spot.findByPk(spotId)) {
            return res.status(404).json({ message: "Spot couldn't be found"})
        }

        const spot = await Spot.findAll({
            where: {id: spotId},
            include: [
                { model: Review, attributes: ['review', 'stars'] },
                { model: SpotImage, attributes: ['id', 'url', 'preview'] },
                { model: User, attributes: ['id', 'firstName', 'lastName'] }
            ]
        })

        const newFormat = spot.map(spotElements => {
            const reviews = spotElements.dataValues.Reviews;

            const spotRatings = reviews.map(reviewStars => reviewStars.stars);
            const spotReviews = reviews.map(review => review.dataValues.review)

            const avgRating = getAverage(spotRatings);
            const countingReviews = countReviews(spotReviews)

            const image = spotElements.dataValues.SpotImages;
            const imageElements = image.map(elements => elements.dataValues);

            const owner = spotElements.dataValues.User.dataValues

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
                numReviews: countingReviews,
                avgStarRating: avgRating,
                SpotImages: imageElements,
                Owner: owner
            }
        });

        return res.status(200).json(newFormat);
    }
    catch (error) {
        next(error)
    }
})

router.post('/:spotId/images', requireAuthorization, requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const { url, preview } = req.body;

    try {
      const spot = await Spot.findByPk(spotId);

      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }

      const newImage = await spot.createSpotImage({ url, preview });

      const limitedImage = await SpotImage.findByPk(newImage.id, {
        attributes: ['id', 'url', 'preview']
      });

      res.status(201).json(limitedImage);
    } catch (error) {
      console.error(error);
      next(error);
    }
})


module.exports = router;
