// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
// const { setTokenCookie } = require('../../utils/auth.js');
const { restoreUser } = require('../../utils/auth.js');
// const { requireAuth } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

router.get('/restore-user', (req, res) => {
    return res.json(req.user);
  }
);

// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

// // GET /api/require-auth
// router.get('/require-auth',requireAuth, (req, res) => {
//     return res.json(req.user);
//   }
// );
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });

// router.get('/tests', (req, res) => {
//     res.json('hello world');
// })



router.post('/signup', async (req, res, next) => {
    const {username, email , password} = req.body;
    const saltedAndHashedPassword = await bcrypt.hashSync(password);
    const newUser = await User.create({username, email, hashedPassword: saltedAndHashedPassword});
    const token = jwt.sign({id: newUser.id, username: newUser.username, email: newUser.email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
    if (newUser) {
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: process.env.JWT_EXPIRES_IN
        })
        res.json({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        })
    }
})


module.exports = router;
