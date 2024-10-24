// backend/routes/api/users.js
const express = require('express')
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
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
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
      .withMessage('Please provide a first name.'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a last name.'),
    handleValidationErrors
  ];

// Sign up
router.post('/', validateSignup, async (req, res) => {
  const { email, password, username } = req.body;

  // const existingInfo = await User.findAll({
  //   attributes: ['email', 'username']
  // })
  // const errors = {}
  // existingInfo.forEach(element => {
  //   // Include an error handler for checking if element.attrib exists
  //   if (element.dataValues.email === email) errors.email = "User with that email already exists"
  //   if (element.dataValues.username === username) errors.username = "User with that username already exists"
  // })
  
  // if (Object.keys(errors).length > 0) res.status(500).json({
  //   message: "User already exists",
  //   errors
  // })
  
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ firstName, lastName, email, username, hashedPassword });
  
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