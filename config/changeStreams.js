const ChatMessage = require("../model/ChatMessages");

module.exports = function (io) {
  const messageStream = ChatMessage.watch();

  messageStream.on("change", async (change) => {
    if (change.operationType === "insert") {
      const fullMessage = change.fullDocument;

      // Populate user info so frontend has the username
      const populatedMsg = await ChatMessage.findById(fullMessage._id)
        .populate("user", "username")
        .exec();

      // Now 'io' is defined because we passed it in as an argument!
      io.to(fullMessage.roomid).emit("new_chat_message", populatedMsg);
    }
  });
};
