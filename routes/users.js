const express = require("express");
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('../middleware/passportJWT')

/* GET users listing. */
router.get("/", userController.index);

/* GET users listing. */
router.post("/login", userController.login);

/* GET users listing. */
router.post("/register", [
    body('name').not().isEmpty().withMessage('Pleae input your surname.'),
    body('email').not().isEmpty().withMessage('Please input your Email.').isEmail().withMessage('Email is not correct.'),
    body('password').not().isEmpty().withMessage('Please input your password').isLength({min: 4}).withMessage('Password must be at least 4 letters')
], userController.register);

router.get('/me', [passport.isLogin], userController.me)

module.exports = router;
