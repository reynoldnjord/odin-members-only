var express = require("express");
var router = express.Router();
const index_controller = require("../controllers/indexController");
const auth_controller = require("../controllers/authController");
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

/// HOMEPAGE ///
router.get("/", index_controller.index);
router.post("/", message_controller.delete_message);

/// SiGN UP ///
router.get("/sign-up", auth_controller.signup_get);
router.post("/sign-up", auth_controller.signup_post);

/// LOG IN/ LOG OUT ///
router.get("/log-in", auth_controller.login_get);
router.post("/log-in", auth_controller.login_post);
router.get("/log-out", auth_controller.logout_get);

/// MEMBER ///
router.get("/member", user_controller.member_get);
router.post("/member", user_controller.member_post);

/// CREATE MESSAGE ///
router.get("/message", message_controller.create_message_get);
router.post("/message", message_controller.create_message_post);

/// ADMIN ///
router.get("/admin", user_controller.admin_get);
router.post("/admin", user_controller.admin_post);

module.exports = router;
