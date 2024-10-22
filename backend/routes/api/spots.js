const express = require('express');
const router = express.Router();
// const apiRouter = require('./api');
const {Spot, SpotImage, Review, User} = require("../../db/models");
const { Model, json } = require('sequelize');
const { requireAuth, requireAuthorization } = require('../../utils/auth');
const { parse } = require('dotenv');
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
    const {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
    let error = {}
         if(page < 1) error.page = "Page must be greater than or equal to 1";
         if(size < 1 || size > 20) error.size = "Size must be between 1 and 20";
         if(maxLat > 90) error.maxLat = "Maximum latitude is invalid";
         if(minLat < -90) error.minLat = "Minimum latitude is invalid";
         if(minLng < -180) error.minLng = "Minimum longitude is invalid";
         if(maxLng > 180) error.maxLng = "Maximum longitude is invalid";
         if(minPrice < 0 ) error.minPrice = "Minimum price must be greater than or equal to 0";
         if(maxPrice > 1000000) error.maxPrice = "Maximum price must be greater than or equal to 0";


     if (Object.keys(error).length > 0) {
        return res.status(400).json({
            "message": "Bad Request",
            "errors": error
        });
    }

      try {

        let pageNumber = parseInt(page);
        let sizeNumber = parseInt(size)

        if (Number.isNaN(pageNumber) || pageNumber < 1) pageNumber = 1
        if (Number.isNaN(sizeNumber) || (sizeNumber < 1 || sizeNumber > 20)) sizeNumber = 20;

            const spots = await Spot.findAll({
            include: [
                { model: SpotImage, attributes: ['url'] },
                { model: Review, attributes: ['stars'] }],
                limit: sizeNumber,
                offset:  sizeNumber*(pageNumber-1)
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
                avgRating: avgRating,
            }
        });

    return res.json({
        // spots
        Spots: newFormat,
        page: pageNumber,
        size: sizeNumber
    })
} catch(error) {
        //  res.status(400).json({
        //      "message": "Bad request",
        //      "errors": options
        //  })
    next(error)
}
})


router.post("/", requireAuth, async (req,res,next) => {
    console.log(req.body)
    const { address, city, state, country, lat, lng, name, price, description} = req.body;
    const ownerId = req.user.id;
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

       let options = {}
       error.errors.map(element => {
            console.log(element)
            if(element.path === "address") element.message = options.address = "Street address is required";
            if(element.path === "city") element.message = options.city = "City is required";
            if(element.path === "state") element.message = options.state = "State is required";
            if(element.path === "country") element.message = options.country = "Country is required";
            if(element.path === "lat") element.message = options.lat = "Latitude must be within -90 and 90";
            if(element.path === "lng") element.message = options.lng = "Longitude must be within -180 and 180";
            if(element.path === "name") element.message = options.name = "Name must be less than 50 characters";
            if(element.path === "description") element.message = options.description = "Description is required";
            if(element.path === "price") element.message = options.price = "Price per day must be a positive number";
        })
            res.status(400).json({
                "message": "Bad request",
                "errors": options
            })
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

router.post('/:spotId/images', requireAuth, requireAuthorization, async (req, res, next) => {
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


router.put("/:spotId", requireAuth, requireAuthorization, async (req, res, next) => {

    const spotId = req.params.spotId;
    const findSpotId = await Spot.findByPk(spotId);
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    // console.log(lng)
    console.log(findSpotId)
    try {
        if (!findSpotId) return res.status(404).json({
            "message": "Spot couldn't be found"
          })

          const updateSpot = await Spot.findOne({
            where: {id: spotId}
          })

        //   console.log(req.body)
          updateSpot.set({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
          })

          await updateSpot.save();

          res.json(updateSpot)
    } catch(error) {
        // if (error.name === "SequelizeValidationError") {
        //     const errorHandler = error.errors.map(element => element.message = `${element.path} is required`);
        //     res.status(400).json({
        //         "message": "Bad Request",
        //         "errors": errorHandler
        //     })
        // }

       let options = {}
       error.errors.map(element => {
            console.log(element)
            if(element.path === "address") element.message = options.address = "Street address is required";
            if(element.path === "city") element.message = options.city = "City is required";
            if(element.path === "state") element.message = options.state = "State is required";
            if(element.path === "country") element.message = options.country = "Country is required";
            if(element.path === "lat") element.message = options.lat = "Latitude must be within -90 and 90";
            if(element.path === "lng") element.message = options.lng = "Longitude must be within -180 and 180";
            if(element.path === "name") element.message = options.name = "Name must be less than 50 characters";
            if(element.path === "description") element.message = options.description = "Description is required";
            if(element.path === "price") element.message = options.price = "Price per day must be a positive number";
        })
            res.status(400).json({
                "message": "Bad request",
                "errors": options
            })
            next(error)
    }
})



router.delete("/:spotId", requireAuth, requireAuthorization, async (req, res, next) => {
    try {
    const spotId = req.params.spotId;
    const findSpotId = await Spot.findByPk(spotId);
    if (!findSpotId) return res.status(404).json({"message": "Spot couldn't be found"});
    await findSpotId.destroy();

    res.json({
    "message": "Successfully deleted"
    })
} catch(error) {
    next(error)
}
})

module.exports = router;
