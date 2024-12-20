// backend/routes/api/users.js
const express = require('express');
// const {Op} = require("sequelize");
const router = express.Router();
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Username is required'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required'),
    handleValidationErrors
  ];

  router.post(
    '/',
      validateSignup,
      async (req, res, next) => {
        const { email, password, username, firstName, lastName } = req.body;
  
        const existingUser = await User.findOne({ where: { email } });
        const existingUsername = await User.findOne({ where: { username } });
  
        if (existingUser && !existingUsername) {
          return res.status(500).json({
            message: "User already exists",
            errors: { email: "User with that email already exists" }
          });
        } 
  
       else if (existingUsername && !existingUser) {
          return res.status(500).json({
            message: "User already exists",
            errors: { username: "User with that username already exists" }
          });
        }

      else if (existingUser && existingUsername) {
        return res.status(500).json({
          message: "User and email already exist",
          errors: {
            email: "User with that email already exists",
            username: "User with that username already exists"
          }
        });
      }
  
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({ email, username, firstName, lastName, hashedPassword });
  
        const safeUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };
  
        await setTokenCookie(res, safeUser);
  
        return res.status(201).json({
          user: safeUser
        });
      }
    );



module.exports = router;