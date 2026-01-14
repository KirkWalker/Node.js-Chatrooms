const Chatroom = require("../model/Chatroom");
const ChatMessage = require("../model/ChatMessages");

const getAllChatrooms = async (req, res) => {
  //res.json(data.employees);
  const rooms = await Chatroom.find().select("roomname _id");
  if (!rooms) return res.status(204).json({ message: "No chatrooms found" });
  res.json(rooms);
};

const createNewChatroom = async (req, res) => {
  if (!req?.body?.roomName) {
    return res.status(400).json({ message: "Room name is rquired" });
  }

  try {
    const result = await Chatroom.create({
      roomname: req.body.roomName,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const deleteRoom = async (req, res) => {
  if (!req?.body?.roomid)
    return res.status(400).json({ message: "ID param is required rquired" });

  const room = await Chatroom.findOne({ _id: req.body.roomid }).exec();
  if (!room) {
    return res
      .status(204)
      .json({ message: `room ID ${req.body.roomid} not found` });
  }

  const roomDeleteResult = await room.deleteOne({ _id: req.body.roomid });
  const messageDeleteResult = await ChatMessage.deleteMany({
    roomid: req.body.roomid,
  });
  res.json({
    roomDeleted: roomDeleteResult,
    messagesDeletedCount: messageDeleteResult.deletedCount,
    message: "Room and associated messages cleared.",
  });
};

module.exports = {
  getAllChatrooms,
  createNewChatroom,
  deleteRoom,
};
