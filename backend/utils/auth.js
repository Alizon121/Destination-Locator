// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Review } = require('../db/models');
const review = require('../db/models/review');
const { secret, expiresIn } = jwtConfig;

//SetTokenCookie
// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const token = jwt.sign(
      { data: safeUser },
      secret,
      { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
    });

    return token;
  };


  const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        return next();
      }

      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, {
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']
          }
        });
      } catch (e) {
        res.clearCookie('token');
        return next();
      }

      if (!req.user) res.clearCookie('token');

      return next();
    });
  };

  // If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    // err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
  }

  // const requireAuthorization = async function (req, res, next) {
  //   const mainUser = req.user.dataValues.id;

  //   const reviewData = await Review.findOne({
  //     where: {id: req.params.spotId}
  //   })

  //   if (!reviewData) {
  //     return res.status(404).json({"message": "Spot couldn't be found"});
  // }

  //   const userId = reviewData.dataValues.userId;

  //   if (mainUser === userId) return next();
  //   const err = new Error('Authorization required');
  //   err.title = 'Authorization required';
  //   err.errors = { message: 'Authorization required' };
  //   err.status = 404;
  //   return next(err);

  // }

  module.exports = { setTokenCookie, restoreUser, requireAuth};
