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
import { authenticateRequests } from "./backend/utils/middlewares.mjs";
import MongoStore from "connect-mongo";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { createMessage } from "./backend/controllers/messages.mjs";

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

App.use(express.json());
App.use(express.static(join(__dirname, "/frontend/dist")));

App.use((req, res, next) => {
  let method = req.method;
  let url = req.url;
  let status = req.statusCode;

  console.log(`${method} : http://localhost:${PORT}${url} : ${status} `);

  next();
});

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

App.use("/api/auth", authRouter);

App.use(authenticateRequests);
App.use("/api/user", userRouter);
App.use("/api/message", messageRouter);
App.use("/api/room", roomRouter);
App.get("*", (req, res) => res.sendFile("/index.html"));

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
    const createdMessage = await createMessage(data);

    // Send to a specific room
    io.to(data.room).emit("message", createdMessage);
  });

  socket.on("disconnect", () => {
    delete CONNECTED_USERS_MAP[user_id];
    io.emit("connected_clients", Object.keys(CONNECTED_USERS_MAP));
  });
});

server.listen(PORT, () => {
  mongoose
    .connect(MONGODB_URI, {
      dbName: "moza_chat",
    })
    .then(() => {})
    .catch((e) => console.log(e.message.toUpperCase()));
});
