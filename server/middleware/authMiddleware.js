const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin)
    return res.status(403).json({ error: "Admin access required" });

  next();
};

module.exports = { auth, isAdmin };
