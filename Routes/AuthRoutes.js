const express = require('express');
const router = express.Router();

//require authentication controller
const AuthController = require('../controllers/AuthController');
//require from validation
const { RegisterRequest, LoginRequest } = require('../Requests/Auth');
//require middleware
const { UserAuth } = require('../Middleware/Authentication');


/* ---------------------- add middleware to the routes ---------------------- */
//catch json data
router.use(express.json());
//catch url encoded data
router.use(express.urlencoded({extended: true}));

/* ---------------------------- define the routes --------------------------- */
const authController = new AuthController();
//#ANCHOR register
router.route('/register').post(RegisterRequest, authController.register);
//#ANCHOR login
router.route('/login').post(LoginRequest, authController.login);
//#ANCHOR logout
//add user authentication middleware
router.route('/logout').post(UserAuth,authController.logout);

module.exports = router;