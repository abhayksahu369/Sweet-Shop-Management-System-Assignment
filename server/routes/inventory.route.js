const express = require("express");
const router = express.Router();

const { purchaseSweet, restockSweet } = require("../controllers/inventory.controller");
const { auth, isAdmin } = require("../middleware/authMiddleware");

router.post("/:id/purchase", auth, purchaseSweet);
router.post("/:id/restock", auth, isAdmin, restockSweet);

module.exports = router;
