import User from "../database/models/users.mjs";

export const createAccount = async (req, res) => {
  try {
    const createdAccount = await User.create(req.body);
    res.json(createdAccount);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
};

export const updateAccount = (req, res) => {};
