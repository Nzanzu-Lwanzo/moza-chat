// IMPORTS *****************************************************
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import messageRouter from "./backend/routes/messages.mjs";
import roomRouter from "./backend/routes/rooms.mjs";
import userRouter from "./backend/routes/users.mjs";
import authRouter from "./backend/auth/routes/auth.mjs";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import MongoStore from "connect-mongo";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import {
  createMessage,
  deleteAllUserMessagesFromRoom,
  updateMessage,
} from "./backend/controllers/messages.mjs";
import Message from "./backend/database/models/messages.mjs";
import webpush from "web-push";
import { authenticateRequests } from "./backend/utils/middlewares.mjs";
import User from "./backend/database/models/users.mjs";

// VARIABLES AND CONSTANTS ****************************************
const App = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const RUNENV = process.env.RUNENV || "dev";
const SECRET = process.env.SECRET;
const WHITELIST_ORIGINS = [
  "http://localhost:5000",
  "http://localhost:5173",
  "https://mozachat.netlify.com",
  "https://mozachat.onrender.com",
];
let cookiesMaxAge = 60 * 60 * 24 * 30 * 1500;
let storeSessionExpiryDate = 60 * 60 * 24 * 30 * 1500;
let refreshStoredSessionInterval = 24 * 3600;
const corsOptions = {
  origin: WHITELIST_ORIGINS,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
  // maxAge : 5 * 60000
};
const server = createServer(App);
const io = new Server(server, {
  cors: corsOptions,
  connectionStateRecovery: {
    maxDisconnectionDuration: 25000,
    skipMiddlewares: true,
  },
});

// WEBPUSH
const webPushMailTo = "nzanzu.lwanzo.work@gmail.com";
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  `mailto:${webPushMailTo}`,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// MIDDLEWARES AND ROUTES *******************************************
App.use(express.json());
App.use(express.static(join(__dirname, "frontend", "dist")));
App.use((req, res, next) => {
  let method = req.method;
  let url = req.url;
  let status = req.statusCode;

  console.log(`${method} : http://localhost:${PORT}${url} : ${status} `);

  next();
});

App.set("trust proxy", 1);

App.use(cors(corsOptions));
App.use(cookieParser());
App.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: SECRET,
    cookie: {
      maxAge: cookiesMaxAge, // 30 days
      httpOnly: RUNENV !== "dev",
      secure: RUNENV !== "dev",
      sameSite: RUNENV !== "dev" ? "none" : "lax",
    },
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      dbName: "moza_chat",
      ttl: storeSessionExpiryDate,
      touchAfter: refreshStoredSessionInterval,
    }),
  })
);
App.use(passport.initialize());
App.use(passport.session());

App.use(authenticateRequests).post(
  "/api/subscribe-to-push",
  async (req, res) => {
    const subscription = req.body;

    if (!subscription.endpoint || !subscription.keys) {
      return res.sendStatus(400);
    }

    try {
      // Save it on the User model
      await User.findByIdAndUpdate(req.user._id, { $set: { subscription } });

      res
        .status(200)
        .json({ ok: true, message: "Subscription saved into the database !" });
    } catch (e) {
      res.sendStatus(400);
    }
  }
);
App.use("/api/auth", authRouter);
App.use("/api/user", userRouter);
App.use("/api/message", messageRouter);
App.use("/api/room", roomRouter);
App.get("*", (req, res) => {
  res.sendFile(join(__dirname, "frontend", "dist", "index.html"));
});

// SOCKET IO ****************************************************
const CONNECTED_USERS_MAP = {};

io.on("connection", async (socket) => {
  let user_id = socket.handshake.auth.uid;
  let socket_id = socket.id;

  CONNECTED_USERS_MAP[user_id] = socket_id;

  io.emit("connected_clients", Object.keys(CONNECTED_USERS_MAP));

  socket.on("join_room", async (room_id) => {
    socket.join(room_id);
  });

  socket.on("message", async (data) => {
    const createdMessage = await createMessage(data.message);

    // Send to a specific room
    io.to(data.room).emit("message", createdMessage);

    // Send notifications
    // try {
    //   data?.all_ids?.forEach(async (id) => {
    //     const { subscription } = await User.findById(id, {
    //       _id: false,
    //       subscription: true,
    //     });
    //     try {
    //       webpush.sendNotification(
    //         subscription,
    //         JSON.stringify(createdMessage),
    //         {
    //           urgency: "high",
    //         }
    //       );
    //     } catch (e) {}
    //   });
    // } catch (e) {}
  });

  socket.on("update_message", async (data) => {
    const updatedMessage = await updateMessage(data, user_id);
    io.to(data.room).emit("update_message", updatedMessage);
  });

  socket.on("delete_message", async (data) => {
    const deletedMessage = await Message.findByIdAndDelete(data.message_id);
    io.to(data.room_id).emit("delete_message", data);
  });

  socket.on("delete_messages", async ({ user_id: uid, room_id }) => {
    const deletedMessages = await deleteAllUserMessagesFromRoom(uid, room_id);
    let dataToEmit = deletedMessages == 0 ? undefined : { uid, room_id };
    io.to(room_id).emit("delete_messages", dataToEmit);
  });

  socket.on("disconnect", () => {
    delete CONNECTED_USERS_MAP[user_id];
    io.emit("connected_clients", Object.keys(CONNECTED_USERS_MAP));
  });
});

// SERVER LISTEN *************************************************
server.listen(PORT, () => {
  mongoose
    .connect(MONGODB_URI, {
      dbName: "moza_chat",
    })
    .then(() => {})
    .catch((e) => console.log(e.message.toUpperCase()));
});

// EXPORTS *******************************************************
export { io };
