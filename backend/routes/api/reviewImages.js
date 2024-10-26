const express = require('express');
const router = express.Router();

const {Spot, SpotImage, Review, ReviewImage, User} = require("../../db/models");
const { Model, json } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { parse } = require('dotenv');
const review = require('../../db/models/review');



router.delete('/:reviewImageId', requireAuth, async (req, res, next) => {
    try {
        const { reviewImageId } = req.params;
        const user = req.user.id

        const findingImageId = await ReviewImage.findOne({ 
            where: { id: reviewImageId },
            include: {model: Review, attributes: ['userId']}
        });

        console.log(findingImageId)
        if (!findingImageId) return res.status(404).json({ message: "Review Image couldn't be found"})
        if (user !== findingImageId.Review.userId ) res.status(403).json({message: "Forbidden"})
            
        await findingImageId.destroy();
        res.json({ message: "Successfully deleted" })
    } catch(error) {
        next(error)
    }
})

module.exports = router;
