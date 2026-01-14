const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatroomSchema = new Schema({
  roomname: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Chatroom", chatroomSchema);
