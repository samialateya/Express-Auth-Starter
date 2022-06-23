const express = require('express');
const router = express.Router();
//require the controller
const ProfileController = require('../controllers/ProfileController');
//require middleware
const { UserAuth } = require('../Middleware/Authentication');

/* ---------------------------- define the routes --------------------------- */
const profileController = new ProfileController();
//*fetch profile info
router.route('/').get(UserAuth, profileController.getProfile);

module.exports = router;