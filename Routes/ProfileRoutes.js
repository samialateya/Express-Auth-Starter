const express = require('express');
const router = express.Router();
//*require the controller
const ProfileController = require('../controllers/ProfileController');
//*require the request validator
const { UpdateBasicInfoRequest, UpdateAvatarRequest } = require('../Requests/Profile');
//*require middleware
const { UserAuth } = require('../Middleware/Authentication');
const multer = require('multer')();

/* ---------------------- add middleware to the routes ---------------------- */
//catch json data
router.use(express.json());
//catch url encoded data
router.use(express.urlencoded({ extended: true }));
//catch multipart data
router.use(multer.single('avatar'));

/* ---------------------------- define the routes --------------------------- */
const profileController = new ProfileController();
//*fetch profile info
router.route('/').get(UserAuth, profileController.getProfile);
//*update profile basic info
router.route('/update/basic').put(UpdateBasicInfoRequest, UserAuth, profileController.updateBasicInfo);
//*update profile avatar
router.route('/update/avatar').put(UpdateAvatarRequest, UserAuth, profileController.updateAvatar);

module.exports = router;