import Message from "../database/models/messages.mjs";
import Room from "../database/models/rooms.mjs";
import { filesEnum } from "../database/models/messages.mjs";

export const createMessage = async (message) => {
  const createdMessage = await Message.create(message);

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
