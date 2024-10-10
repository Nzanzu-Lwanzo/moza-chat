import { Router } from "express";
import { deleteMessage } from "../controllers/messages.mjs";
import { validateParamId } from "../utils/middlewares.mjs";

const messageRouter = Router();

messageRouter.delete("/:id", validateParamId, deleteMessage);

export default messageRouter;
