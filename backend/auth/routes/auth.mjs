import { Router } from "express";
import "../strategies/local.mjs";
import passport from "passport";
import { signUpLocal, loginLocal, logOut } from "../controllers/auth.mjs";
import { userSchema } from "../../utils/validation/user.mjs";
import { checkSchema } from "express-validator";
import { getValidData } from "../../utils/middlewares.mjs";

const authRouter = Router();

authRouter.post("/login", passport.authenticate("local", {}), loginLocal);
authRouter.get("/logout", logOut);
authRouter.post("/signup", checkSchema(userSchema), getValidData, signUpLocal);

export default authRouter;
