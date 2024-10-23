import { Router } from "express";
import {
  deleteRoom,
  getAllRooms,
  getRoom,
  initRoom,
  updateRoom,
  getRoomsMessages,
} from "../controllers/rooms.mjs";
import {
  validateParamId,
  getValidData,
  authenticateRequests,
} from "../utils/middlewares.mjs";
import { roomSchema } from "../utils/validation/room.mjs";
import { checkSchema } from "express-validator";

const roomRouter = Router();

roomRouter.use(authenticateRequests);
roomRouter.post("/", checkSchema(roomSchema), getValidData, initRoom);
roomRouter.get("/all", getAllRooms);
roomRouter.get("/messages/:id", validateParamId, getRoomsMessages);
roomRouter.get("/:id", validateParamId, getRoom);
roomRouter.delete("/:id", validateParamId, deleteRoom);
roomRouter.patch("/:id", validateParamId, updateRoom);

export default roomRouter;
