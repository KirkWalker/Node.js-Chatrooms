const express = require("express");
const router = express.Router();
const chatroomController = require("../../controllers/chatroomController");
const ROLES_LIST = require("../../config/role_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(chatroomController.getAllChatrooms)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    chatroomController.createNewChatroom
  )
  .delete(verifyRoles(ROLES_LIST.Admin), chatroomController.deleteRoom);

module.exports = router;
