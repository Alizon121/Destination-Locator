const express = require('express');
const router = express.Router();
const {Op, where} = require("sequelize")
const {check} = require("express-validator");
const {handleValidationErrors} = require("../../utils/validation")
// const apiRouter = require('./api');
const {Spot, SpotImage, Review, User, ReviewImage, Booking} = require("../../db/models");
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

function roundToTenths(num) {
    return Math.round(num * 10) / 10;
  }
/*************************Get All Spots ************************************/
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
            ? roundToTenths(spotData.Reviews.reduce((acc, review) => acc + review.stars, 0) / spotData.Reviews.length)
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

    const { address, city, state, country, lat, lng, name, price, description, previewImage} = req.body;
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
        where: {spotId: spotId},
        include: [
            {model: User, attributes: ["id", "firstName", "lastName"]},
            {model: ReviewImage, attributes: ['id', 'url']}
            ]
        }
    )
    const reviews = findReview.map(element => {
            return element
    })

        return res.json({
            Reviews: reviews
        })
    })

/*************************Get all Bookings for a Spot Based on the's Id *******/
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
        const spotId = req.params.spotId;
        const userId = req.user.id
        const spot = await Spot.findByPk(spotId)

        if (!spot) {
            res.status(404).json({
                "message": "Spot couldn't be found"
            })
        }
        // If the user is NOT the owner of the spot
    try {
        if (spot.dataValues.ownerId !== userId) {

        const bookingSpot = await Booking.findAll({
            where: {spotId: spotId},
            attributes: ['spotId', 'startDate', 'endDate']
            })
        return res.json({
            Bookings: bookingSpot
        })
        }

        if (spot.dataValues.ownerId === userId) {
            const bookingSpot = await Booking.findAll({
            where: {spotId: spotId},
            include: {model: User, attributes: ['id', 'firstName', 'lastName']}
            })
            const bookingOwnerInfo = bookingSpot.map((data) => {

                return {
                    User: data.dataValues.User,
                    id: data.dataValues.id,
                    spotId: data.dataValues.spotId,
                    userId: data.dataValues.userId,
                    startDate: data.dataValues.startDate,
                    endDate: data.dataValues.endDate,
                    createdAt: data.dataValues.createdAt,
                    updatedAt: data.dataValues.updatedAt
                }
            })

            return res.json({
                Bookings: bookingOwnerInfo
            })
        }
    }
    catch (error) {
        next(error)
    }
})

/*********************Create a Bookinhg from a Spot based on the Spot's id*********/

router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const spotId = req.params.spotId
    const { startDate, endDate} = req.body;
    try {
        const spot = await Spot.findAll({
            where: {id: spotId}
        })

        // Authorization/spot validations
        const authorization = spot.find((data) =>  data.dataValues.ownerId === userId)
        if (authorization) return res.status(403).json({message: "Forbidden"})

        // Validation if specific spot does not exist
        if (!spot) return res.status(404).json({message: "Spot couldn't be found"})
        
         // Start date cannot be in the past
        const errors = {}
        const currentDate = new Date(Date.now()).toLocaleDateString()
        const currentDateSplit = currentDate.split('/');
        const currentDateSplitYear = currentDateSplit[2];
        const currentDateSplitMonth = currentDateSplit[0];
        const currentDateSplitDay = currentDateSplit[1];
        const formattedCurrentDate = `${currentDateSplitYear}-${currentDateSplitMonth}-${currentDateSplitDay}`
        if (Date.parse(startDate) <= Date.parse(formattedCurrentDate) ) {
            errors.startDate = "startDate cannot be in the past"
        } 

        // End date cannot be on or before the start date
        if (Date.parse(endDate) <= Date.parse(startDate)) {
            errors.endDate = "endDate cannot be on or before the startDate"
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Bad Request",
                errors: errors
            })
        }

        // Booking conflict validation
        // Check to see if the booking falls between an existing booking date
        const existingBookings = await Booking.findAll({
            where: {
                [Op.or]: [
                    {
                        startDate: {
                            [Op.lte]: endDate
                        },
                        endDate: {
                            [Op.gte]: startDate
                        }
                    }
                ]
            }
        })

        // for (let el of existingBookings) {
        //     console.log(el.dataValues.startDate)
        // }

        const existingBookingStartDate = existingBookings.map((booking) => {
            const startDateData =  booking.dataValues.startDate
            const year = startDateData.getUTCFullYear()
            const month = (startDateData.getUTCMonth()+1).toString().padStart(2, '0')
            const date = (startDateData.getUTCDate()).toString().padStart(2, '0')
            return `${year}-${month}-${date}`
        })

        const existingBookingEndDate = existingBookings.map((booking) => {
            const endDateData =  booking.dataValues.endDate
            const year = endDateData.getUTCFullYear()
            const month = (endDateData.getUTCMonth()+1).toString().padStart(2, '0')
            const date = (endDateData.getUTCDate()).toString().padStart(2, '0')
            return `${year}-${month}-${date}`
        })

        if (existingBookings.length !== 0) {
            const bodyValidationErrors = {}
            // Check to see if the existing dates fall between the request start/end date
            if (Date.parse(existingBookingStartDate) <= Date.parse(endDate) && Date.parse(existingBookingStartDate) >= Date.parse(startDate)) {
                bodyValidationErrors.startDate = 'Start Date conflicts with an existing booking'
            }
            // Check if the existing date falls beetween the request start/end date
            if (Date.parse(existingBookingEndDate) >= Date.parse(startDate) && Date.parse(existingBookingEndDate) <= Date.parse(endDate)) {
                bodyValidationErrors.endDate = 'End date conflicts with an existing booking'
            }
            if (Object.keys(bodyValidationErrors).length > 0) {
                return res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    errors: bodyValidationErrors
                    })
                }
        }

        // Create the booking
        const newBooking = await Booking.create({
            spotId: Number(spotId),
            userId: userId,
            startDate: startDate,
            endDate: endDate,
        })
        res.status(201).json(newBooking)

    } catch (error) {
        next(error)
    }
    }
)
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

        const reviewWithAssociations = await Review.findByPk(newReview.id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'], // Only include necessary fields
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url'], // Only include necessary fields
                },
            ],
        });

        return res.status(201).json(reviewWithAssociations);
    }
    catch(error) {
        next(error)
    }
})

module.exports = router;
