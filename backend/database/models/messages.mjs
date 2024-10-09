import mongoose, { mongo } from "mongoose";

let filesEnum = ["image", "doc", "video", "audio"];

const MessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Vous devez fournir un message"],
    },

    room: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },

    file: {
      type: String,
      enum: filesEnum,
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
