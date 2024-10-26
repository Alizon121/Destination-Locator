const express = require('express');
const router = express.Router();

const {Spot, SpotImage, Review, ReviewImage, User} = require("../../db/models");
const { Model, json } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { parse } = require('dotenv');
const review = require('../../db/models/review');


/**********Delete a Review image ****************/
router.delete("/:imageId", requireAuth, async (req, res, next) => {

    try {

        const userId = req.user.id;
        const imageId = req.params.imageId;

        // const reviewImage = await ReviewImage.findByPk(imageId);
        const reviewImage = await ReviewImage.findOne({
            where: {
                id: imageId
            }
        })

        if (!reviewImage) return res.status(404).json({ message: "Review Image couldn't be found" });

        const review = await Review.findByPk(reviewImage.reviewId);

        if (review.userId !== userId) return res.status(403).json({ message: "Unauthorized" });

        await reviewImage.destroy();

        res.status(200).json({ message: "Successfully deleted" });

    } catch (err) {
        next(err)
    }
})

// router.delete('/:reviewImageId', requireAuth, async (req, res, next) => {
//     try {
//         const { reviewImageId } = req.params;
//         const user = req.user.id

//         const findingImageId = await ReviewImage.findOne({ 
//             where: { id: reviewImageId },
//             include: {model: Review, attributes: ['userId']}
//         });

//         console.log(findingImageId)

//         if (!findingImageId) return res.status(404).json({ message: "Review Image couldn't be found"})
//         if (user !== findingImageId.Review.userId ) res.status(403).json({message: "Forbidden"})

//         await findingImageId.destroy();
//         res.json({ message: "Successfully deleted" })
//     } catch(error) {
//         next(error)
//     }
// })

module.exports = router;
