const express = require('express');
const router = express.Router();
// const apiRouter = require('./api');
const {Spot, SpotImage, Review} = require("../../db/models");
const { Model } = require('sequelize');



// router.use('/api', apiRouter);

function getAverage(arr) {

    if (arr.length === 0) {
      return 0; // Return 0 if the array is empty to avoid division by zero
    }

    const sum = arr.reduce((acc, val) => acc + val, 0);
    const average = sum / arr.length;
    return Number.parseFloat(average).toFixed(1);
  }


  router.get("/", async (req,res,next) => {
      try {
            const spots = await Spot.findAll({
            include: [{
                model: SpotImage,
            attributes: ['url'],
            }],
            include: [{
                model: Review,
                attributes: ['stars']
            }]
        })

        // const ratings = reviewElements.map(review => {
        //     return review.dataValues.stars;
        // });
        // const avgRating = getAverage(ratings);

    return res.json({
        spots
    })
} catch(error) {
    next(error)
}
})


module.exports = router;
