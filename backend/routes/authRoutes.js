const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authControllers');
const wrapAsync = require('../utills/wrapAsync');
const verifyToken = require('../middlewares/authMiddleware');

router.post("/register", wrapAsync(authController.register));
router.get("/verify/:token", wrapAsync(authController.verifyEmail));
router.post("/login",wrapAsync(authController.login));
router.get("/protected", verifyToken , wrapAsync(authController.protected));


module.exports = router;