import { Router } from "express";
import {
  deleteAllUserMessagesFromRoom,
  deleteMessage,
} from "../controllers/messages.mjs";
import { validateParamId } from "../utils/middlewares.mjs";

const messageRouter = Router();

messageRouter.delete("/:id", validateParamId, deleteMessage);

messageRouter.delete(
  "/all/:id",
  validateParamId,
  deleteAllUserMessagesFromRoom
);

export default messageRouter;
