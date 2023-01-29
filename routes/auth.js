const authController = require("../controllers/auth.controller");
const router = require("express").Router();
router.post("/register", authController.Register);
router.post("/login", authController.Login);
module.exports = router;
