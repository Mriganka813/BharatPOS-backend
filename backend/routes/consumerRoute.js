const express = require("express");
const { registerConsumer, loginConsumer, consumerLogout } = require("../controllers/consumerController");
const router = express.Router();

router.route("/consumer/register").post(registerConsumer);

router.route("/consumer/login").post(loginConsumer);

router.route("/consumer/logout").get(consumerLogout)
module.exports = router;