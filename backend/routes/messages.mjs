import { Router } from "express";
import {
  deleteAllUserMessagesFromRoom,
  deleteMessage,
  updateMessage,
} from "../controllers/messages.mjs";
import {
  authenticateRequests,
  validateParamId,
} from "../utils/middlewares.mjs";

const messageRouter = Router();

// messageRouter.use(authenticateRequests);
// messageRouter.delete("/:id", validateParamId, deleteMessage);
// messageRouter.delete(
//   "/all/:id",
//   validateParamId,
//   deleteAllUserMessagesFromRoom
// );

export default messageRouter;
