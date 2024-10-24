const express = require('express');
const router = express.Router();

const {Spot, SpotImage, Review, ReviewImage, User} = require("../../db/models");
const { Model, json } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { parse } = require('dotenv');
const review = require('../../db/models/review');

// router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
//     const {url} = req.body;
//     const reviewId = req.params.reviewId;
//     const findReviewId = await Review.findByPk(reviewId);

//     // const poo = await Review.findAll()
//     // // console.log(poo);
    
//     if (!findReviewId) {
//         res.status(404).json({
//             "message": "Review couldn't be found"
//           })
//     }
//     if (findReviewId.userId !== req.user.id) return res.status(403).json({
//             "message": "Forbidden"
//           })
    
//     if (findReviewId.length > 10) {
//         res.status(403).json({
//             "message": "Maximum number of images for this resource was reached"
//           })
//     };

//     const newImage = await findReviewId.createReviewImage({ url });
//     console.log(newImage)
//     const limitedImage = await ReviewImage.findByPk(newImage.id, {
//         attributes: ['id', 'url']
//       });

//     res.status(201).json(limitedImage)
// })



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

module.exports = router