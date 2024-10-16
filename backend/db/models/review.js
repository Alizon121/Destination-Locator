'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        as: "User"
      })

      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        as: "Spot"
      })

      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        onDelete: 'CASCADE',
        hook: true
      })
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Spots",
        key: "id"
      },
    onDelete: "CASCADE"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      },
      onDelete: "CASCADE",
    },
    review: {
      type: DataTypes.STRING,
    },
    stars: {
      type: DataTypes.INTEGER,
      validate: {
        len: [1,1],
        isInt: true
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
