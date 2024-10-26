const express = require('express');
const router = express.Router();
const {Op} = require("sequelize")
const {check} = require("express-validator");
const {handleValidationErrors} = require("../../utils/validation")
// const apiRouter = require('./api');
const {Spot, SpotImage, Review, User, ReviewImage} = require("../../db/models");
const { Model, json } = require('sequelize');
const { requireAuth, requireAuthorization } = require('../../utils/auth');
const { parse } = require('dotenv');
const review = require('../../db/models/review');
// router.use('/api', apiRouter);

const validateSpot = [
    check('address')
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .notEmpty()
        .withMessage('Latitude is required')
        // .bail()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .notEmpty()
        .withMessage('Longitude is required')
        // .bail()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be within -180 and 180'),
    check('name')
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .notEmpty()
        .withMessage('Price cannot be empty')
        .isFloat({ gt: 0 })
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];

const validateReview = (req, res, next) => {
    const { review, stars } = req.body;
    const errors = {};
    if (!review) errors.review = "Review text is required";
    if (!stars || stars < 1 || stars > 5) errors.stars = "Stars must be an integer from 1 to 5";
  
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        "message": "Validation error",
        "errors": errors
      })
    }
    next();
  }


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

/*************************Get All Spots ************************************/
//   router.get("/", validateSpot, async (req,res,next) => {
//     const {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
    // let error = {}
    //      if(page < 1) error.page = "Page must be greater than or equal to 1";
    //      if(size < 1 || size > 20) error.size = "Size must be between 1 and 20";
    //      if(maxLat > 90) error.maxLat = "Maximum latitude is invalid";
    //      if(minLat < -90) error.minLat = "Minimum latitude is invalid";
    //      if(minLng < -180) error.minLng = "Minimum longitude is invalid";
    //      if(maxLng > 180) error.maxLng = "Maximum longitude is invalid";
    //      if(minPrice < 0 ) error.minPrice = "Minimum price must be greater than or equal to 0";
    //      if(maxPrice > 1000000) error.maxPrice = "Maximum price must be greater than or equal to 0";


    //  if (Object.keys(error).length > 0) {
    //     return res.status(400).json({
    //         "message": "Bad Request",
    //         "errors": error
    //     });
    // }
//       try {

//         let pageNumber = parseInt(page);
//         let sizeNumber = parseInt(size)

//         if (Number.isNaN(pageNumber) || pageNumber < 1) pageNumber = 1
//         if (Number.isNaN(sizeNumber) || (sizeNumber < 1 || sizeNumber > 20)) sizeNumber = 20;

//             const spots = await Spot.findAll({
//             include: [
//                 { model: SpotImage, attributes: ['url'] },
//                 { model: Review, attributes: ['stars'] }],
//                 limit: sizeNumber,
//                 offset:  sizeNumber*(pageNumber-1)
//         })

//         const newFormat = spots.map(spotElements => {
//             const reviews = spotElements.Reviews;
//             const spotRatings = reviews.map(reviewStars => reviewStars.stars);
//             const avgRating = getAverage(spotRatings);

//             const spotImagesDetails = spotElements.dataValues.SpotImages;
//             const url = spotImagesDetails.map(element => element.dataValues.url);

//             return {
//                 id: spotElements.id,
//                 ownerId: spotElements.ownerId,
//                 address: spotElements.address,
//                 city: spotElements.city,
//                 state: spotElements.state,
//                 country: spotElements.country,
//                 lat: parseFloat(spotElements.lat),
//                 lng: parseFloat(spotElements.lng),
//                 name: spotElements.name,
//                 description: spotElements.description,
//                 price: spotElements.price,
//                 createdAt: spotElements.createdAt,
//                 updatedAt: spotElements.updatedAt,
//                 previewImage: url[0],
//                 avgRating: avgRating,
//             }
//         });

//     return res.json({
//         // spots
//         Spots: newFormat,
//         page: pageNumber,
//         size: sizeNumber
//     })
// } catch(error) {
//         //  res.status(400).json({
//         //      "message": "Bad request",
//         //      "errors": options
//         //  })
//     next(error)
// }
// })

router.get("/", async (req, res, next) => {
    try {
        const {
            page = 1,
            size = 20,
            minLat,
            maxLat,
            minLng,
            maxLng,
            minPrice,
            maxPrice
        } = req.query; // extract query parameters from req.query

        // apply pagination with default values and validate them
        const pagination = {};

        const errors = {};

        if (parseInt(page, 10) >= 1 && parseInt(size, 10) >= 1 && parseInt(size, 10) <= 20) {
            pagination.limit = parseInt(size, 10);
            pagination.offset = (parseInt(page, 10) - 1) * parseInt(size, 10);
        } else {
            errors.page = "Page must be greater than or equal to 1";
            errors.size = "Size must be between 1 and 20";
        }

        // Apply filters (lat, long, price) if provided and valid
        const where = {};

        if (minLat && (isNaN(minLat) || minLat < -90 || minLat > 90)) {
            errors.minLat = "minLat must be a number between -90 and 90";
        } else if (minLat) {
            where.lat = { [Op.gte]: parseFloat(minLat) };
        }

        if (maxLat && (isNaN(maxLat) || maxLat < -90 || maxLat > 90)) {
            errors.maxLat = "maxLat must be a number between -90 and 90";
        } else if (maxLat) {
            where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };
        }

        if (minLng && (isNaN(minLng) || minLng < -180 || minLng > 180)) {
            errors.minLng = "minLng must be a number between -180 and 180";
        } else if (minLng) {
            where.lng = { [Op.gte]: parseFloat(minLng) };
        }

        if (maxLng && (isNaN(maxLng) || maxLng < -180 || maxLng > 180)) {
            errors.maxLng = "maxLng must be a number between -180 and 180";
        } else if (maxLng) {
            where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };
        }

        if (minPrice && (isNaN(minPrice) || minPrice < 0)) {
            errors.minPrice = "minPrice must be a number greater than or equal to 0";
        } else if (minPrice) {
            where.price = { [Op.gte]: parseFloat(minPrice) };
        }

        if (maxPrice && (isNaN(maxPrice) || maxPrice < 0)) {
            errors.maxPrice = "maxPrice must be a number greater than or equal to 0";
        } else if (maxPrice) {
            where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };
        }

        // If there are validation errors, return them
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Bad Request",
                errors
            });
        }

        // use spot.findAll() with the 'where' clause and 'pagination' applied.
        const spots = await Spot.findAll({
            include: [
                { model: Review, attributes: ['stars'] },
                { model: SpotImage, attributes: ['url'] }
            ],
            where,
            ...pagination
        });

        const spotList = spots.map(spot => {

            const spotData = spot.toJSON();

            const avgRating = spotData.Reviews && spotData.Reviews.length > 0
            ? spotData.Reviews.reduce((acc, review) => acc + review.stars, 0) / spotData.Reviews.length
            : 0;

            const previewImage = spot.SpotImages[0] ? spot.SpotImages[0].url : null;

            delete spotData.SpotImages;

            delete spotData.Reviews;

            return {
                ...spotData,
                lat: parseFloat(spotData.lat), // cast to number
                lng: parseFloat(spotData.lng), // cast to number
                price: parseFloat(spotData.price), // cast to number
                avgRating,
                previewImage
            };
        });

        // also, include pagination data in the response
        res.status(200).json({ Spots: spotList, page: parseInt(page, 10), size: parseInt(size, 10) });

    } catch (err) {
        next(err);
    }
});
/***************************CREATE A SPOT *****************************/
router.post("/", requireAuth, validateSpot, async (req,res,next) => {

    const { address, city, state, country, lat, lng, name, price, description} = req.body;
    const ownerId = req.user.id;
    try {
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
    } catch(error) {
            next(error)
    }
})

/***********************GET All Spots of Current User ***********************/
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

    res.json({
        Spots: newFormat
    });
})

/**************************Get Details of a Spot from Id *****************************/
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

    for (let el in newFormat) {
        if (spotId == newFormat[el].id) {
            return res.status(200).json(newFormat[el]);
        }
    }

    }
    catch (error) {
        next(error)
    }
})

/***********************Get All Reviews by a Spot's Id *************************/
router.get("/:spotId/reviews", async (req, res, next) => {
    const spotId = req.params.spotId;
    const findSpot = await Spot.findByPk(spotId);

    if (!findSpot) {
        res.status(404).json({message: "Spot couldn't be found"})
    }

    const findReview = await Review.findAll({
        where: {id: spotId},
        include: [
            {model: User, as: "User", attributes: ["id", "firstName", "lastName"]},
            {model: ReviewImage, attributes: ['id', 'url']}
            ]
        }
    )
    const reviews = findReview.map(element => {
            return element
    })
    console.log(reviews)
    // const user = reviews.map

        return res.json({
            Reviews: reviews
        })
    })

/*************************Add Image to a Spot by Id *************************/
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const { url, preview } = req.body;

    try {
      const spot = await Spot.findByPk(spotId);
      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }
      if (req.user.id !== spot.ownerId) return res.status(403).json({message: "Forbidden"})


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

/**********************Edit a Spot ******************************/
router.put("/:spotId", requireAuth, validateSpot, async (req, res, next) => {

    const spotId = req.params.spotId;
    const findSpotId = await Spot.findByPk(spotId);
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    try {
        if (!findSpotId) return res.status(404).json({
            "message": "Spot couldn't be found"
        })
        if (req.user.id !== findSpotId.ownerId) return res.status(403).json({message: "Forbidden"})

          const updateSpot = await Spot.findOne({
            where: {id: spotId}
          })
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
            next(error)
    }
})


/***************Delete a Spot *****************************/
router.delete("/:spotId", requireAuth, async (req, res, next) => {
    try {
    const spotId = req.params.spotId;
    const findSpotId = await Spot.findByPk(spotId);
    if (!findSpotId) return res.status(404).json({"message": "Spot couldn't be found"});
    if (req.user.id !== findSpotId.ownerId) return res.status(403).json({message: "Forbidden"})

    await findSpotId.destroy();

    res.json({
    "message": "Successfully deleted"
    })
} catch(error) {
    next(error)
}
})



























/***************************CREATE A REVIEW*****************************/
//  Review from the current user already exists for the Spot
router.post("/:spotId/reviews", requireAuth,  validateReview, async (req,res,next) => {
    const { review, stars } = req.body;
    const userId = req.user.id;
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);
    if (!spot) return res.status(404).json({ "message": "Spot couldn't be found"})

    const existingReview = await Review.findOne({
        where: {spotId , userId}
    });
    if (existingReview) return res.status(500).json({ "message": "User already has a review for this spot" })

    try {
        const newReview = await Review.create({
            userId,
            spotId,
            review,
            stars,
        })

        return res.status(201).json(newReview);
    }
    catch(error) {
        // let options = {}
        // error.errors.map(element => {
        //      if(element.path === "review") element.message = options.review = "Review text is required";
        //      if(element.path === "stars") element.message = options.stars = "Stars must be an integer from 1 to 5";
        //  })
        //      res.status(400).json({
        //          "message": "Bad Request",
        //          "errors": options
        //      })
             next(error)
    }
})

module.exports = router;
