const express = require("express");
const router = express.Router();
const chatController = require("../../controllers/chatsController");
const ROLES_LIST = require("../../config/role_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(chatController.getChatByRoom)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User),
    chatController.createNewChat
  )
  .delete(verifyRoles(ROLES_LIST.Admin), chatController.deleteChat);

module.exports = router;
