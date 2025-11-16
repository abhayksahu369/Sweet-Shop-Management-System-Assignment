const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  // Intentionally do nothing to make tests fail (Red step)
  return res.status(500).json({ error: "Failed to register user" });
};

const login = async (req, res) => {
  // Intentionally do nothing to make tests fail (Red step)
  return res.status(500).json({ error: "Failed to login" });
};


module.exports = {register,login,};
