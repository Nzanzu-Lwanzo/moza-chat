import mongoose from "mongoose";


export let maxLengthName = 64;
export let minLengthName = 10;

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: maxLengthName,
      minLength: minLengthName,
      unique : true
    },

    description: String,

    picture: String,

    participants: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],

    restricted: {
      type: Boolean,
      default: false,
    },

    private: {
      type: Boolean,
      default: false,
    },

    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", RoomSchema);

export default Room;
