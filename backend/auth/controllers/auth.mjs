import dotenv from "dotenv";
dotenv.config();
import User from "../../database/models/users.mjs";
import { generateToken } from "../../utils/authTokens.mjs";

const RUNENV = process.env.RUNENV || "dev";

export const signUpLocal = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (e) {
    let message = e.message;
    let name = e.message;

    if (message.includes("name_1 dup key")) {
      return res.status(406).json({ message: "DUPLICATE_USERNAME" });
    }

    if (message.includes("email_1 dup key")) {
      return res.status(406).json({ message: "DUPLICATE_EMAIL" });
    }

    return res.sendStatus(400);
  }
};

export const loginLocal = (req, res) => {
  if (!req.user || !req.session.passport)
    return res.status(404).json({ message: "NO_USER_IN_SESSION" });
  res.json(req.user);
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const logOut = (req, res) => {
  res.clearCookie("connect.sid").sendStatus(200);
};
