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

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user._id } },
      { password: 0 },
      { lean: true }
    );
    res.json(users);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
};

export const updateAccount = (req, res) => {};
