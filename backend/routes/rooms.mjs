import { Router } from "express";
import {
  deleteRoom,
  getAllRooms,
  getRoom,
  initRoom,
  updateRoom,
} from "../controllers/rooms.mjs";
import { validateParmId, getValidData } from "../utils/middlewares.mjs";
import { roomSchema } from "../utils/validation/room.mjs";
import { checkSchema } from "express-validator";

const roomRouter = Router();

roomRouter.post("/", checkSchema(roomSchema), getValidData, initRoom);
roomRouter.get("/all", getAllRooms);
roomRouter.get("/:id", validateParmId, getRoom);
roomRouter.delete("/:id", validateParmId, deleteRoom);
roomRouter.patch("/:id", validateParmId, updateRoom);

export default roomRouter;
