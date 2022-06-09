const express = require('express');
const router = express.Router();

//require authentication controller
const AuthController = require('../controllers/AuthController');
//require from validation
const { RegisterRequest } = require('../Requests/Auth/RegisterRequest');


/* ---------------------- add middleware to the routes ---------------------- */
//catch json data
router.use(express.json());
//catch url encoded data
router.use(express.urlencoded({extended: true}));

/* ---------------------------- define the routes --------------------------- */
const authController = new AuthController();
//#ANCHOR register
router.route('/register').post(RegisterRequest, authController.register);

module.exports = router;