import mongoose from "mongoose";
import { generate } from "../../utils/passwordManager.mjs";

export let maxLengthName = 64;
export let minLengthName = 2;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Vous devez fournir un nom utilisateur pour ce compte."],
    trim: true,
    minLength: [
      minLengthName,
      `Le nom doit avoir une longueur de minimum : ${minLengthName}`,
    ],
    maxLength: [
      maxLengthName,
      `Le nom doit avoir une longueur de maximum : ${maxLengthName}`,
    ],
  },

  email: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Vous devez fournir un mot de passe"],
    set: function (value) {
      return generate(value);
    },
  },

  picture: String,

  subscription: {
    endpoint: String,
    expirationTime: Number,
    keys: {
      p256dh: String,
      auth: String,
    },
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
