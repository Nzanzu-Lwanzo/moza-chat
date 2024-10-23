import Message from "../database/models/messages.mjs";
import Room from "../database/models/rooms.mjs";
import { filesEnum } from "../database/models/messages.mjs";
import { Server } from "socket.io";
import mongoose from "mongoose";

/**
 *
 * @param {object}} message
 * @param {Server} io
 * @returns {Message}
 */
export const createMessage = async (message, send) => {
  const createdMessage = await (
    await (
      await Message.create(message)
    ).populate({
      path: "sendee",
      select: "_id name",
    })
  ).populate({
    path: "room",
    select: "_id name",
  });

  // This operation can be performed after
  await Room.findByIdAndUpdate(message.room, {
    $addToSet: { messages: (await createdMessage)._id },
  });

  return createdMessage;
};

export const deleteMessage = async (req, res) => {
  try {
    let { id } = req.params;

    const deletedMessage = await Message.findByIdAndDelete(id, { new: true });
    let roomId = deletedMessage.room;
    let messageId = deletedMessage._id;
    await Room.findByIdAndUpdate(roomId, { $pull: { messages: messageId } });

    res.sendStatus(204);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
};

export const deleteAllUserMessagesFromRoom = async (req, res) => {
  try {
    const deletedMessages = await Message.deleteMany(
      { sendee: new mongoose.Types.ObjectId(req.user._id) },
      {}
    );
    console.log(deletedMessages);
    res.sendStatus(204);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
};
