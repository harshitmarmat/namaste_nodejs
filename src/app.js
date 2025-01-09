const express = require("express");
const { connectDb } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const { chatRouter, sendMessage } = require("./routes/chat");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const Redis = require("ioredis");
const { getUserId } = require("./middlewares/auth");
const redis = new Redis({
  host: "127.0.0.1", // Redis server IP
  port: 6379, // Redis server port
  password: "", // Add if Redis requires authentication
});
const httpServer = createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    // methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO connection
io.on("connection", async (socket) => {
  const rawCookies = socket.handshake.headers.cookie;
  if(!rawCookies) return
  console.log("logg===>>>",rawCookies);
  
  const parsedCookies = cookieParser.JSONCookies(
    require("cookie").parse(rawCookies)
  );
  const { userId: senderId } = await getUserId(parsedCookies.token);
  console.log("Parsed Cookies (JSON):", senderId);
  // socket.on("disconnect", () => {
  //   console.log("Client disconnected:", socket.id);
  // });
  // socket.on('register',(userId)=>{
  //   userSocketID[userId] = socket.id
  // })

  socket.on("register", async () => {
    await redis.set(senderId, socket.id);
    // console.log(`User ${userId} mapped to socket ${socket.id}`);
    // redis.get("Numan", (err, socketId) => {
    // console.log(socketId);

    // if (err) console.error(err);
    // else {
    //     if (socketId) {
    // io.to(socketId).emit("message", { from: "userA", text: "Hello!" });
    //     } else {
    //         console.log('User not online.');
    //     }
    // }
    // });
  });

  socket.on("sendMesssage", async(data) => {
    const res = await sendMessage({
      loggedInUserID: senderId,
      conversationId: data.conversationThread,
      toUserId: data.toUserId,
      content: data.content,
    });
    redis.get(data.toUserId,(err,socketId)=> {
      console.log(socketId);
      if(socketId){
        io.to(socketId).emit("recieveMessage",res)
      }
    })
    redis.get(senderId,(err,socketId)=> {
      console.log(socketId);
      if(socketId){
        io.to(socketId).emit("recieveMessage",res)
      }
    })
  });
});

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

connectDb()
  .then(() => {
    console.log("connection with database successfully established.");
    httpServer.listen("7777", () => {
      console.log("Listening server on port 7777...");
    });
  })
  .catch((err) => {
    console.log("Error in connecting with database" + err);
  });
