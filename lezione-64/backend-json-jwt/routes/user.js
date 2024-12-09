const express = require("express");
const userController = require("../controller/user");
const { checkAuth } = require("../middleware/checkAuth");
const { sleep } = require("../middleware/sleep");
const router = express.Router();

router.post("/signup", sleep, userController.signup);

router.post("/login", sleep, userController.login);

module.exports = router;
