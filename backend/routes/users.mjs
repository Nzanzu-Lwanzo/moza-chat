import { Router } from "express";
import { createAccount, getAllUsers } from "../controllers/users.mjs";
import { checkSchema } from "express-validator";
import { authenticateRequests, getValidData } from "../utils/middlewares.mjs";
import { userSchema } from "../utils/validation/user.mjs";

const userRouter = Router();

userRouter.post("/", checkSchema(userSchema), getValidData, createAccount);
userRouter.use(authenticateRequests).get("/", getAllUsers);

export default userRouter;
