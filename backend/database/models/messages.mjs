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
      ref: "User",
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

MessageSchema.post("deleteMany", function (message, next) {
  console.log(message);
});

MessageSchema.post("deleteOne", function (message, next) {
  console.log(message);
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;
