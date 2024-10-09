import Room from "../database/models/rooms.mjs";
import { validateArrayOfIds } from "../utils/validation/room.mjs";

export const updateActions = {
  adp: async function (req, res, id) {
    let ids = req.body;
    if (!validateArrayOfIds(ids)) return res.sendStatus(400);

    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { $addToSet: { participants: { $each: ids } } },
      { new: true }
    );

    return updatedRoom;
  },
  rmp: async function (req, res, id) {
    let ids = req.body;

    if (!validateArrayOfIds(ids)) return res.sendStatus(400);

    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { $pullAll: { participants: ids } },
      { new: true }
    );

    return updatedRoom;
  },
  gen: async function (req, res, id) {
    if (Array.isArray(req.body))
      return res.status(406).json({
        message: "Vous avez soumis un tableau au lieu d'un object de données !",
      });

    const updatedRoom = await Room.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return updatedRoom;
  },
};

const updateActionsArray = Object.keys(updateActions);

export const initRoom = async (req, res) => {
  try {
    const createdRoom = await Room.create(req.body);
    res.status(201).json(createdRoom);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
};

export const getRoom = async (req, res) => {
  try {
    let { id } = req.params;

    const foundRoom = await Room.findById(id).populate(
      "participants",
      "name email picture"
    );

    if (!foundRoom) return res.sendStatus(404);

    res.json(foundRoom);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
};

export const deleteRoom = async (req, res) => {
  let { id } = req.params;

  try {
    const deletedRoom = await Room.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
};

export const updateRoom = async (req, res) => {
  try {
    let { action } = req.query;

    if (!updateActionsArray.includes(action)) return res.sendStatus(400);

    let { id } = req.params;

    let resBack = await updateActions[action](req, res, id);

    return res.json(resBack);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
};

// Get all the rooms so the user can choose which they to partake in
// If the room is private, that means the only way to be part of it
// is to be invited by somebody that's already inside it.
// So that means, the room is not publicly visible.
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ private: true });
    res.json(rooms);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
};
