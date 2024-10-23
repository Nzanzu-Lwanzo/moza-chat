import mongoose, { mongo } from "mongoose";

export let filesEnum = ["image", "doc", "video", "audio"];

const MessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Vous devez fournir un message"],
    },

    sendee: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },

    room: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Room",
    },

    refBy: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;
