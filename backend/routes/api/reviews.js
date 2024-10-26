const express = require('express');
const router = express.Router();
const {Spot, SpotImage, Review, ReviewImage, User} = require("../../db/models");
const { Model, json } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { parse } = require('dotenv');
const review = require('../../db/models/review');

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

/***********************GET All Reviews of Current User ***********************/
router.get('/current', requireAuth, async (req, res, next) => {
    const currentId = req.user.dataValues.id;

    const reviews = await Review.findAll({
        where: { userId: currentId },
        include: [
            { model: User, as: 'User', attributes: ['id', 'firstName', 'lastName']},
            { model: Spot, as: 'Spot',include: [{model: SpotImage, attributes: ['url'], where: { preview: true }, required: false}], attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']},
            { model: ReviewImage, attributes: ['id', 'url']},
        ]
    });

    const newFormat = reviews.map(reviewElements => {
        const review = reviewElements.dataValues;
        const userInfo = reviewElements.dataValues.User.dataValues;
        const spotInfo = reviewElements.dataValues.Spot.dataValues;
        const previewImageDetails = reviewElements.dataValues.ReviewImages.map(elements => elements.dataValues.url);
        const reviewInfo = reviewElements.dataValues.ReviewImages.map(elements => elements.dataValues);

        previewImageDetails.length > 0 ? spotInfo.previewImage = previewImageDetails[0] : null

        return {
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            User: userInfo,
            Spot: {
                id: review.Spot.id,
                ownerId: review.Spot.ownerId,
                address: review.Spot.address,
                city: review.Spot.city,
                state: review.Spot.state,
                country: review.Spot.country,
                lat: review.Spot.lat,
                lng: review.Spot.lng,
                name: review.Spot.name,
                price: review.Spot.price,
                previewImage: review.Spot.SpotImages.length > 0 ? review.Spot.SpotImages[0].url : null
            },
            ReviewImages: reviewInfo
        }
    })

    res.json({ Reviews: newFormat });
});

/**********************Edit a Review******************************/
router.put("/:reviewId", requireAuth, validateReview, async (req, res, next) => {
    const {reviewId} = req.params;
    const { review, stars } = req.body;

    try {
        const findingReview = await Review.findByPk(reviewId);
        if (!findingReview) return res.status(404).json({ message: "Review couldn't be found" })

        if (req.user.id !== findingReview.userId) return res.status(403).json({message: "Forbidden"})

        const updateReview = await Review.findOne({ where: {id: reviewId} });
        updateReview.set({ review, stars })

        await updateReview.save();
        res.json(updateReview)
    } catch(error) {
    //    let options = {}
    //    error.errors.map(element => {
    //         if(element.path === "review") element.message = options.review = "Review text is required";
    //         if(element.path === "stars") element.message = options.stars = "Stars must be an integer from 1 to 5";
    //     })
    //         res.status(400).json({
    //             "message": "Bad request",
    //             "errors": options
    //         })
            next(error)
    }
})

/******************* Add an Image to a Review ************/
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const { url } = req.body;

    try {
      const review = await Review.findOne({
        where: {id:reviewId}
    });

      if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" });
      }
      if (req.user.id !== review.userId) return res.status(403).json({message: "Forbidden"})


      const newImage = await review.createReviewImage({ url });

      const limitedImage = await ReviewImage.findByPk(newImage.id, {
        attributes: ['id', 'url']
      });

      res.status(201).json(limitedImage);
    } catch (error) {
      console.error(error);
      next(error);
    }
})

/************************Delete a Review *****************/
// router.delete("/:reviewId", requireAuth, async (req, res, next) => {
    // try {

//         const userId = req.user.id;
//         const reviewId = req.params.reviewId;

//         const review = await Review.findByPk(reviewId);

//         if (!review) {
//             return res.status(404).json({ message: "Review couldn't be found" });
//         };

//         if (review.userId !== userId) {
//             return res.status(403).json({ message: "Unauthorized" });
//         };

//         await ReviewImage.destroy({ where: { reviewId: reviewId } });

//         await review.destroy();

//         res.status(200).json({ message: "Successfully deleted" });

//     } catch(err) {
//         next(err)
//     }
// })


router.delete("/:reviewId", requireAuth, async (req, res, next) => {
    try {
        const reviewId = req.params.reviewId;
        const findReviewId = await Review.findByPk(reviewId);
        if (!findReviewId) return res.status(404).json({message: "Review couldn't be found"});
        if (req.user.id !== reviewId) return res.status(403).json({message: "Forbidden"})
        await findReviewId.destroy();
    
        return res.json({
        message: "Successfully deleted"
        })
    } catch(err) {
        next(err)
    }
})

module.exports = router

