import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import messageRouter from "./backend/routes/messages.mjs";
import roomRouter from "./backend/routes/rooms.mjs";
import userRouter from "./backend/routes/users.mjs";

const App = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

App.use(express.json());
App.use(express.static(join(__dirname, "/frontend/dist")));

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
