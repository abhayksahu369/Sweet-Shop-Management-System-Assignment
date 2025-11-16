const Sweet = require("../models/sweet.model");

const purchaseSweet = async (req, res) => {
  try {
    const { amount } = req.body; 
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid purchase amount" });
    }

    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ error: "Sweet not found" });
    }

    if (sweet.quantity < amount) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    sweet.quantity -= amount;
    await sweet.save();

    return res.status(200).json({
      message: `Successfully purchased ${amount} sweet(s)`,
      remainingQuantity: sweet.quantity,
    });
  } catch (err) {
    console.error("Error purchasing sweet:", err);
    return res.status(500).json({ error: "Failed to purchase sweet" });
  }
};


const restockSweet = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid restock amount" });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ error: "Sweet not found" });
    }

    sweet.quantity += amount;
    await sweet.save();

    return res.status(200).json({
      message: "Sweet restocked successfully",
      newQuantity: sweet.quantity,
    });
  } catch (err) {
    console.error("Error restocking sweet:", err);
    return res.status(500).json({ error: "Failed to restock sweet" });
  }
};

module.exports = { purchaseSweet, restockSweet };
