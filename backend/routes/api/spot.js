const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const {Spot, SpotImage, Review} = require("../../db/models");
const { Model } = require('sequelize');

router.use('/api', apiRouter);

function getAverage(arr) {
    if (arr.length === 0) {
      return 0; // Return 0 if the array is empty to avoid division by zero
    }
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
  }


router.get("/spots", async (req,res,next) => {
    try { 
    const ratings = await Review.findAll({
        where: {
            ratings: "stars"
        }
    })

    const avgRating = getAverage(ratings);

    const spots = await Spot.findAll(
        {include: [{
            model: SpotImage,
            where: {previewImage: "url"}
            },
            {
            model: Review,
            where: {
                avgRating: avgRating
            }
             }
            ]
        }
    )
    return res.json(spots)
} catch(error) {
    next(error)
}
})
