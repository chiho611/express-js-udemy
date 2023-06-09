const express = require('express');
const {check, body} = require('express-validator')
const authController = require('../controllers/auth');
const User = require("../models/user");

const router = express.Router();

router.get('/login', authController.getLogin);
router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .normalizeEmail(),
        body('password', 'Password has to be valid.')
            .isLength({min: 4})
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin
);
router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please Enter A Valid Email!')
            .custom((value, {req}) => {
                // if (value === 'test@test.com') {
                //     throw new Error('This email address is forbidden.')
                // }
                return User.findOne({email: value})
                    .then(user => {
                        if (user) {
                            return Promise.reject('E-Mail exists already, please pick a different one.')
                        }
                        // return true;
                    })
            })
            .normalizeEmail(),
        body('password', 'Please enter the password with number and letter and at least 5 characters!')
            .isLength({min: 4, max: 30})
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error('Password must be match!');
                }
                return true;
            })
    ]
    , authController.postSignup);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;