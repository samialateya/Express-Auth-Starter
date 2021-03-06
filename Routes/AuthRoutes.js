const express = require('express');
const router = express.Router();

//require authentication controller
const AuthController = require('../controllers/AuthController');
//require from validation
const { RegisterRequest, LoginRequest, SendVerificationEmailRequest, ResetPasswordRequest } = require('../Requests/Auth');
//require middleware
const { UserAuth } = require('../Middleware/Authentication');


/* ---------------------- add middleware to the routes ---------------------- */
//catch json data
router.use(express.json());
//catch url encoded data
router.use(express.urlencoded({extended: true}));

/* ---------------------------- define the routes --------------------------- */
const authController = new AuthController();
//ANCHOR register
router.route('/register').post(RegisterRequest, authController.register);
//ANCHOR login
router.route('/login').post(LoginRequest, authController.login);
//ANCHOR logout
router.route('/logout').post(UserAuth ,authController.logout);
//ANCHOR Send verification email
router.route('/email-verification/send').post(SendVerificationEmailRequest, authController.sendVerificationEmail);
//ANCHOR verify email
router.route('/email-verification/verify').get(authController.verifyEmail);

//SECTION reset password
//*send email to reset password
router.route('/reset-password/send').post(SendVerificationEmailRequest, authController.sendResetPasswordEmail);
//*verify the token and open update password page
router.route('/reset-password/verify').get(authController.verifyResetPasswordToken);
//*update password
router.route('/reset-password/update').post(ResetPasswordRequest, authController.updatePassword);
//#!SECTION reset password

module.exports = router;