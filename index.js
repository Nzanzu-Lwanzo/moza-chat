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

const App = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const RUNENV = process.env.RUNENV || "dev";
const SECRET = process.env.SECRET;
const WHITELIST_ORIGINS = ["http://localhost:5000", "http://localhost:5173"];
let cookiesMaxAge = 60 * 60 * 24 * 30 * 1500;
let storeSessionExpiryDate = 60 * 60 * 24 * 30 * 1500;
let refreshStoredSessionInterval = 24 * 3600;

App.use(express.json());
App.use(express.static(join(__dirname, "/frontend/dist")));

App.use((req, res, next) => {
  let method = req.method;
  let url = req.url;
  let status = req.statusCode;

  console.log(`${method} : http://localhost:${PORT}${url} : ${status} `);

  next();
});

App.use(
  cors({
    origin: WHITELIST_ORIGINS,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
    // maxAge : 5 * 60000
  })
);
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

App.listen(PORT, () => {
  console.log("SERVER UP AND RUNNING");
  mongoose
    .connect(MONGODB_URI, {
      dbName: "moza_chat",
    })
    .then(() => console.log("CONNECTED TO DABATASE"))
    .catch((e) => console.log(e.message.toUpperCase()));
});
