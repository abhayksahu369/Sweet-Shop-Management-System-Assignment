import { useState } from "react";
import api from "../api/api"; // your axios instance

const SweetCard = ({ sweet, onPurchaseSuccess }) => {
  const [qty, setQty] = useState(1);
  const [currentQuantity, setCurrentQuantity] = useState(sweet.quantity);
  const [loading, setLoading] = useState(false);

  const increaseQty = () => {
    if (qty < currentQuantity) setQty(qty + 1);
  };

  const decreaseQty = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handlePurchase = async () => {
    if (qty <= 0) return;

    try {
      setLoading(true);
      const response = await api.post(`/sweets/${sweet._id}/purchase`, {
        amount: qty,
      });
      alert(response.data.message);
      setCurrentQuantity(response.data.remainingQuantity);
      if (qty > response.data.remainingQuantity) setQty(1);
      if (onPurchaseSuccess) onPurchaseSuccess(sweet._id, response.data.remainingQuantity);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Purchase failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 border border-pink-100 hover:shadow-xl transition transform hover:-translate-y-1">
      <img
        src={sweet.image}
        alt={sweet.name}
        className="w-full h-40 object-cover rounded-md"
      />

      <h2 className="text-lg font-semibold text-pink-700 mt-3">{sweet.name}</h2>
      <p className="text-gray-500 text-sm capitalize">{sweet.category}</p>
      <p className="text-gray-700 text-xs mt-1 line-clamp-2">{sweet.description}</p>

      <p className="text-pink-700 font-bold mt-3">₹{sweet.price} / piece</p>

      <p className="text-sm mt-1 font-medium text-gray-600">
        Available: <span className="text-pink-600">{currentQuantity}</span>
      </p>

      {/* Quantity Selector */}
      <div className="mt-3 flex items-center justify-between border border-pink-300 rounded-lg px-3 py-2">
        <button
          onClick={decreaseQty}
          disabled={qty <= 1}
          className="px-3 py-1 text-lg text-white bg-pink-400 rounded-md disabled:bg-gray-300"
        >
          −
        </button>

        <span className="text-pink-700 font-bold text-lg">{qty}</span>

        <button
          onClick={increaseQty}
          disabled={qty >= currentQuantity}
          className="px-3 py-1 text-lg text-white bg-pink-500 rounded-md disabled:bg-gray-300"
        >
          +
        </button>
      </div>

      {/* Total Amount */}
      <p className="text-right mt-2 text-pink-700 font-semibold">
        Total: ₹{(qty * sweet.price).toFixed(2)}
      </p>

      <button
        onClick={handlePurchase}
        disabled={currentQuantity <= 0 || loading}
        className={`mt-4 w-full py-2 rounded-lg font-semibold text-white ${
          currentQuantity > 0
            ? "bg-pink-600 hover:bg-pink-700 active:scale-95"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? "Processing..." : currentQuantity > 0 ? `Purchase ${qty}` : "Out of Stock"}
      </button>
    </div>
  );
};

export default SweetCard;
