const { User } = require("../models");

const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    // paginatedResponse, take page number from query params and return 10 users per page

    const users = await User.find()
      .skip((page - 1) * 10)
      .limit(10);

    // remove password
    users.forEach((user) => {
      delete user.password;
    });

    return res.status(200).json({
      data: {
        users,
      },
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // remove password
    delete user.password;

    return res.status(200).json({
      data: {
        user,
      },
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, name, phoneNumber, countryCode } = req.body;

    // find if user already exists with email or phone number
    const userExists = await User.findOne({
      $or: [{ email }, { phone: phoneNumber }],
    });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      phone: phoneNumber,
      countryCode,
    });

    return res.status(201).json({
      data: {
        user,
      },
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { ...req.body });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.save();

    return res.status(200).json({
      data: {
        user,
      },
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    return res.status(200).json({
      data: {
        user,
      },
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
