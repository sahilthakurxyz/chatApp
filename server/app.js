const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middleware/error");
const User = require("./models/userSchema");
const router = require("./routers/userRoute");
const path = require("path");
const { getUserWithToken } = require("./middleware/getUserWithToken");
const {
  ConversationModel,
  MessageModel,
} = require("./models/conversationSchema");
const { getConversation } = require("./middleware/sidebarConversation");
const { markMessageAsSeen } = require("./middleware/seenMessage");
// Socket
// import for Socket
const http = require("http");
const { Server } = require("socket.io");
// end
const app = express();

//  Socket Connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});
// online User

const onlineUser = new Set();
// socket running on 4001
io.on("connection", async (socket) => {
  console.log("Connect User", socket.id);
  const { token } = socket.handshake.auth;
  // current user detail
  const user = await getUserWithToken(token);

  if (!user || user.success === false || user === undefined) {
    socket.disconnect(true);
    console.log("socket connection disconnect due to token invalidation");
    // force disconnection if the token is invalid
    return;
  }
  // continue with authenicated user
  // create a room

  socket.join(user?.user?._id.toString());
  onlineUser.add(user?.user._id.toString());
  io.emit("onlineUser", Array.from(onlineUser));
  socket.on("message-page", async (userId) => {
    socket.removeAllListeners("new-message");

    const isOnline = Array.from(onlineUser).some(
      (onlineUserId) => onlineUserId.toString() === userId
    );
    const userDetails = await User.findById(userId);
    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.avatar.url,
      lastSeen: userDetails?.lastSeen,
      online: isOnline,
    };
    socket.emit("message-user", payload);
    try {
      const getPrevConversation = await ConversationModel.findOne({
        $or: [
          { sender: user?.user?._id, receiver: userId },
          { sender: userId, receiver: user?.user?._id },
        ],
      }).populate("messages");
      socket.emit("message", getPrevConversation?.messages || []);
    } catch (err) {
      console.log("Error fetching previous message", err);
    }
    // console.log(getConversationMessage, "get conversation");

    // check preview conversion
    socket.on("new-message", async (data) => {
      const sender = data.sender;
      const receiver = data?.receiver;
      // const session = await mongoose.startSession();
      // session.startTransaction();
      try {
        const conversation = await ConversationModel.findOneAndUpdate(
          {
            $or: [
              { sender: sender, receiver: receiver },
              { sender: receiver, receiver: sender },
            ],
          },
          {
            $setOnInsert: { sender, receiver },
          },
          // { upsert: true, new: true, session }
          { upsert: true, new: true }
        );
        // creating message within transaction
        const newMessage = await MessageModel.create(
          {
            text: data?.text,
            imageUrl: data?.photo,
            videoUrl: data?.video,
            senderId: data?.sender,
          }
          // { session }
        );
        await ConversationModel.updateOne(
          { _id: conversation?._id },
          {
            $push: { messages: newMessage?._id },
            $set: { updatedAt: new Date() },
          }
          // { session }
        );
        // await session.commitTransaction();
        // session.endSession();
        const getNewConversationMessage = await ConversationModel.findOne({
          $or: [
            { sender: data?.sender, receiver: data?.receiver },
            { sender: data?.receiver, receiver: data?.sender },
          ],
        })
          .populate("messages")
          .sort({ updatedAt: -1 });
        io.to(data?.sender).emit(
          "message",
          getNewConversationMessage?.messages
        );
        io.to(data?.receiver).emit(
          "message",
          getNewConversationMessage?.messages
        );
        const sidebarConversationSender = await getConversation(data?.sender);
        const sidebarConversationReceiver = await getConversation(
          data?.receiver
        );
        io.to(data?.sender).emit("conversation", sidebarConversationSender);
        io.to(data?.receiver).emit("conversation", sidebarConversationReceiver);
      } catch (error) {
        // await session.abortTransaction();
        // session.endSession();
        console.error("Error processing message:", error);
      }
    });
  });
  socket.on("seen", async (messageSenderId) => {
    await markMessageAsSeen(messageSenderId, user?.user?._id);
  });
  socket.on("last-seen", async (yearMonthDaytime) => {
    const dateStr = yearMonthDaytime.join(" ");

    try {
      await User.findByIdAndUpdate(
        user?.user?._id,
        {
          lastSeen: dateStr,
        },
        {
          new: true,
        }
      );
    } catch (err) {
      console.log(err, "error in last-seen  app.js");
    }
  });
  socket.on("sidebar", async (currentUserId) => {
    const sidebarMessages = await getConversation(currentUserId);
    socket.emit("conversation", sidebarMessages);
  });
  // disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?.user?._id);
    socket.removeAllListeners("seen");
    io.emit("onlineUser", Array.from(onlineUser));
    console.log("disconnect", socket.id);
    console.log(`user disconnected ${user?.user?._id}`);
  });
});
const fileUpload = require("express-fileupload");
const { type } = require("os");
const { default: mongoose } = require("mongoose");

// const { log } = require("console");

const temp = path.join(__dirname, "temp/directory");
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: temp,
  })
);

// Api Route

app.use("/api/chatapp", router);
app.use(errorMiddleware);
module.exports = {
  app,
  server,
};
