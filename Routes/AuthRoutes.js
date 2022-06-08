const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

/* ---------------------- add middleware to the routes ---------------------- */
//catch json data
router.use(express.json());
//catch url encoded data
router.use(express.urlencoded({extended: true}));

/* ---------------------------- define the routes --------------------------- */
const authController = new AuthController();
//#ANCHOR register
router.route('/register').post(authController.register);

module.exports = router;