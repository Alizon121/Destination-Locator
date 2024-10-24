const express = require('express');
const router = express.Router();
const {Spot, SpotImage, Review, ReviewImage, User} = require("../../db/models");
const { Model, json } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { parse } = require('dotenv');
const review = require('../../db/models/review');


/***********************GET All Reviews of Current User ***********************/
router.get('/current', requireAuth, async (req, res, next) => {
    const currentId = req.user.dataValues.id;

    const reviews = await Review.findAll({
        where: { userId: currentId },
        include: [
            { model: User, as: 'User', attributes: ['id', 'firstName', 'lastName']},
            { model: Spot, as: 'Spot', attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']},
            { model: ReviewImage, attributes: ['id', 'url']},
        ]
    });

    const newFormat = reviews.map(reviewElements => {
        const review = reviewElements.dataValues;
        const userInfo = reviewElements.dataValues.User.dataValues;
        const spotInfo = reviewElements.dataValues.Spot.dataValues;
        const previewImageDetails = reviewElements.dataValues.ReviewImages.map(elements => elements.dataValues.url);
        const reviewInfo = reviewElements.dataValues.ReviewImages.map(elements => elements.dataValues);

        //adding previewImage to the Spot object
        spotInfo.previewImage = previewImageDetails[0];

        return {
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            User: userInfo,
            Spot: spotInfo,
            ReviewImages: reviewInfo
        }
    })

    res.json({ Reviews: newFormat });
});

/**********************Edit a Review******************************/
router.put("/:reviewId", requireAuth, async (req, res, next) => {
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
       let options = {}
       error.errors.map(element => {
            if(element.path === "review") element.message = options.review = "Review text is required";
            if(element.path === "stars") element.message = options.stars = "Stars must be an integer from 1 to 5";
        })
            res.status(400).json({
                "message": "Bad request",
                "errors": options
            })
            next(error)
    }
})


router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const { url } = req.body;

    try {
      const review = await Review.findByPk(reviewId);
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
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
    try {
        const reviewId = req.params.reviewId;
        const findReviewId = await Spot.findByPk(reviewId);
        if (!findReviewId) return res.status(404).json({"message": "Spot couldn't be found"});
        if (req.user.id !== findReviewId.ownerId) return res.status(403).json({message: "Forbidden"})
    
        await findReviewId.destroy();
    
        res.json({
        "message": "Successfully deleted"
        })
    } catch(err) {
        next(err)
    }
})

module.exports = router

