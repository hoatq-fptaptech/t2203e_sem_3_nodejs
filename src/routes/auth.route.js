const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const middleware = require("./../middlewares/auth.middleware");

router.use("/register",middleware.guest);
router.use("/login",middleware.guest);
router.use("/change-password",middleware.logged_in);

router.get("/register",controller.register);
router.post("/register",controller.create);
router.get("/login",controller.login);
router.post("/login",controller.loginUser);

router.get("/change-password",controller.changePassForm);
router.post("/change-password",controller.updatePass);

router.post("/forgot-password",controller.forgotPassword);
router.get("/reset-password",controller.resetPasswordForm);
module.exports = router;