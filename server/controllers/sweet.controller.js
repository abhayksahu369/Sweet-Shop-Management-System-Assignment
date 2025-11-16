const Sweet = require("../models/sweet.model");

const addSweet = async (req, res) => {
  try {
    const sweet = await Sweet.create(req.body);
    return res.status(201).json(sweet);
  } catch (err) {
    console.error("Error adding sweet:", err);
    return res.status(500).json({ error: "Failed to add sweet" });
  }
};

const getSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    return res.json(sweets);
  } catch (err) {
    console.error("Error getting sweets:", err);
    return res.status(500).json({ error: "Failed to fetch sweets" });
  }
};

const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const query = {};
    if (name) query.name = new RegExp(name, "i");
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {
        $gte: Number(minPrice) || 0,
        $lte: Number(maxPrice) || 99999,
      };
    }

    const sweets = await Sweet.find(query);
    return res.json(sweets);
  } catch (err) {
    console.error("Error searching sweets:", err);
    return res.status(500).json({ error: "Failed to search sweets" });
  }
};

const updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ error: "Sweet not found" });
    }

    Object.assign(sweet, req.body);
    await sweet.save(); 

    return res.json(sweet);
  } catch (err) {
    console.error("Error updating sweet:", err);
    return res.status(500).json({ error: "Failed to update sweet" });
  }
};


const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ error: "Sweet not found" });
    }

    await Sweet.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Sweet deleted successfully" });
  } catch (err) {
    console.error("Error deleting sweet:", err);
    return res.status(500).json({ error: "Failed to delete sweet" });
  }
};


module.exports = {
  addSweet,
  getSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
};
