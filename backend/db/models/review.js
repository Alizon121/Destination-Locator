'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        // as: "User"
      })

      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        // as: "Spot"
      })

      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        onDelete: 'CASCADE',
        // hook: true
      })
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // unique: true,
      references: {
        model: "Spots",
        key: "id"
      },
    onDelete: "CASCADE"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // unique: true,
      references: {
        model: "Users",
        key: "id"
      },
      onDelete: "CASCADE",
    },
    review: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
        isInt: true,
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
    indexes: [
      {
        unique: true,
        fields: ['spotId', 'userId']
      }
    ]
  });
  return Review;
};
