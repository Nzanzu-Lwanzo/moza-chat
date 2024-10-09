import { Router } from "express";
import { createAccount } from "../controllers/users.mjs";
import { checkSchema } from "express-validator";
import { getValidData } from "../utils/middlewares.mjs";
import { userSchema } from "../utils/validation/user.mjs";

const userRouter = Router();

userRouter.post("/", checkSchema(userSchema), getValidData, createAccount);

export default userRouter;
