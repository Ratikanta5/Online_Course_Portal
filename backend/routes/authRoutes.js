const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authControllers');
const wrapAsync = require('../utills/wrapAsync');


router.post("/register", wrapAsync(authController.register));
router.get("/verify/:token", wrapAsync(authController.verifyEmail));


module.exports = router;