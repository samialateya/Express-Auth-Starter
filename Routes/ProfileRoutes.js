const express = require('express');
const router = express.Router();
//require the controller
const ProfileController = require('../controllers/ProfileController');
//require the request validator
const { UpdateBasicInfoRequest } = require('../Requests/Profile');
//require middleware
const { UserAuth } = require('../Middleware/Authentication');

/* ---------------------- add middleware to the routes ---------------------- */
//catch json data
router.use(express.json());
//catch url encoded data
router.use(express.urlencoded({ extended: true }));

/* ---------------------------- define the routes --------------------------- */
const profileController = new ProfileController();
//*fetch profile info
router.route('/').get(UserAuth, profileController.getProfile);
//*update profile basic info
router.route('/update/basic').put(UpdateBasicInfoRequest, UserAuth, profileController.updateBasicInfo);

module.exports = router;