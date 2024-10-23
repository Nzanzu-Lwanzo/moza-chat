import passport from "passport";
import { Strategy } from "passport-local";
import User from "../../database/models/users.mjs";
import { validate } from "../../utils/passwordManager.mjs";

passport.serializeUser((user, done) =>
  done(null, {
    _id: user._id,
    name: user.name,
    email: user.email,
  })
);

passport.deserializeUser(async (user, done) => done(null, user));

export default passport.use(
  new Strategy({ usernameField: "name" }, async (name, password, done) => {
    try {
      const user = await User.findOne({ name });

      if (!user) throw new Error("USER_NOT_FOUND");

      if (!validate(password, user.password))
        throw new Error("BAD_CREDENTIALS");

      done(null, user);
    } catch (e) {
      done(e, null);
    }
  })
);
