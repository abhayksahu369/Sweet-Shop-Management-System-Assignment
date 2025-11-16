const purchaseSweet = async (req, res) => {
  return res.status(500).json({ error: "Forced failure for TDD Red test" });
};

const restockSweet = async (req, res) => {
  return res.status(500).json({ error: "Forced failure for TDD Red test" });
};

module.exports = { purchaseSweet, restockSweet };
