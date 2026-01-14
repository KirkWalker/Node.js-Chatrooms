require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { logEvents, logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3500;

// --- Connect to mongo db
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
connectDB();

const ChatMessage = require("./model/ChatMessages");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }, // Adjust for your React Native app
});

// --- SECURITY HANDSHAKE ---
app.use(credentials); // 1. Allow credentials (cookies/auth)
app.use(cors(corsOptions)); // 2. Check Allowed Origins

// --- PARSERS & STATIC ---
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "/public")));

require("./config/changeStreams")(io);
app.use(logger);

// --- ROUTES ---
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// --- Authenticated routes
app.use(verifyJWT);

app.use("/employees", require("./routes/api/employees"));
app.use("/chatrooms", require("./routes/api/chatrooms"));
app.use("/chats", require("./routes/api/chatmessage"));
app.use("/users", require("./routes/api/users"));

// --- Handle errors
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

/*

In a standard app, you have to refresh to see new messages. In this app, we’ve closed the loop using MongoDB Change Streams and Socket.io.

The Event: When any user saves a message to MongoDB, the database emits a 'change' event.

The Server: Our Node.js server is 'watching' that stream. The moment it sees a new entry, it grabs that data and broadcasts it through Socket.io to a specific chat room.

The Client: The React Native app is listening for that socket event. When it arrives, we use React Query to surgically inject that message into the local cache.

The result is a UI that stays in sync across all devices without the user ever having to pull-to-refresh.

*/

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // When the React Native app opens a chat, it sends the roomid
  socket.on("join_room", (data) => {
    const { roomid, username } = data;
    socket.join(roomid);
    console.log(`User ${username} joined room: ${roomid}`);
    socket.to(roomid).emit("receive_message", {
      _id: `system-${Date.now()}`, // Unique ID for React FlatList
      message: `${username} has joined the room`,
      system: true, // A flag to tell the UI to style this differently
      createdAt: new Date(),
      user: { username: "System" },
    });
  });

  socket.on("leave_room", (data) => {
    const { roomid, username } = data;
    socket.leave(roomid);
    console.log(`User ${username} left room: ${roomid}`);
    socket.to(roomid).emit("receive_message", {
      _id: `system-${Date.now()}`, // Unique ID for React FlatList
      message: `${username} has left the room`,
      system: true, // A flag to tell the UI to style this differently
      createdAt: new Date(),
      user: { username: "System" },
    });
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected globally`);
  });
});

//console.log("process.env.NODE_ENV",process.env.NODE_ENV);
mongoose.connection.once("open", () => {
  if (!process.env.NODE_ENV === "test" || !process.env.NODE_ENV) {
    console.log("connected to mongo DB");
    // Only start the standalone server if NOT in test mode
    // In test mode, supertest handles the server starting/stopping
    if (process.env.NODE_ENV !== "test") {
      server.listen(PORT, "0.0.0.0", () =>
        console.log(`Server running on port ${PORT}`)
      );
    }
  }
});
module.exports = app;
