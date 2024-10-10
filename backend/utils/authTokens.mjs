import dotenv from "dotenv";
dotenv.config();
import * as pkg from "jsonwebtoken";
const {
  default: { sign, verify },
} = pkg;
const SECRET = process.env.SECRET;

export const generateToken = (payload) => sign(payload, SECRET);

export const decodeToken = (token) => verify(payload, SECRET);
