const express = require("express");
const router = express.Router();
const {addSweet,getSweets,searchSweets,updateSweet,deleteSweet}=require("../controllers/sweet.controller");

const { auth, isAdmin } = require("../middleware/authMiddleware");

router.post("/", auth,isAdmin, addSweet);
router.get("/", auth, getSweets);
router.get("/search", auth, searchSweets);
router.put("/:id", auth,isAdmin, updateSweet);
router.delete("/:id", auth, isAdmin, deleteSweet);

module.exports = router;
