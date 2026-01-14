const ChatMessage = require("../model/ChatMessages");

const getAllChats = async (req, res) => {
  const msgs = await ChatMessage.find().populate("user", "username").exec();
  if (!msgs || msgs.length === 0)
    return res.status(204).json({ message: "No messages" });
  res.json(msgs);
};

const createNewChat = async (req, res) => {
  if (!req?.body?.message) {
    return res.status(400).json({ message: "message is rquired" });
  }
  if (!req?.body?.userid) {
    return res.status(400).json({ message: "user is rquired" });
  }
  if (!req?.body?.roomid) {
    return res.status(400).json({ message: "room is rquired" });
  }

  const { message, roomid } = req.body;
  const userid = req.body.userid;
  try {
    const result = await ChatMessage.create({
      message: message,
      roomid: roomid,
      user: userid,
      timestamp: Date.now(),
    });

    const populatedResult = await result.populate("user", "username");
    res.status(201).json(populatedResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const deleteChat = async (req, res) => {
  if (!req?.body?.msgid)
    return res.status(400).json({ message: "ID param is required rquired" });

  const room = await ChatMessage.findOne({ _id: req.body.msgid }).exec();
  if (!room) {
    return res
      .status(204)
      .json({ message: `msg ID ${req.body.msgid} not found` });
  }

  const result = await room.deleteOne({ _id: req.body.msgid });

  res.json(result);
};

const getChatByRoom = async (req, res) => {
  if (!req.query.roomid)
    return res.status(400).json({ message: "Room ID param is required" });

  const { roomid, before } = req.query;
  let query = { roomid };

  // If 'before' exists, we only find messages created EARLIER than that date
  if (before) {
    query.createdAt = { $lt: before };
  }

  try {
    const msgs = await ChatMessage.find(query)
      .populate("user", "username")
      .sort({ createdAt: -1 }) // Get newest first
      .limit(15) // Only take 15
      .exec();

    if (!msgs || msgs.length === 0) {
      return res.status(200).json([]); // Better for frontend to receive empty array
    }

    // Reverse them before sending so the frontend displays them in chronological order
    res.json(msgs.reverse());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllChats,
  createNewChat,
  deleteChat,
  getChatByRoom,
};
