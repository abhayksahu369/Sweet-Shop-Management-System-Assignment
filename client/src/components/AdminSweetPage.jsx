import { useEffect, useState } from "react";
import api from "../api/api";
import SweetForm from "../components/SweetForm";

export default function AdminSweetsPage() {
  const [sweets, setSweets] = useState([]);
  const [editSweet, setEditSweet] = useState(null);
  const [restockQty, setRestockQty] = useState({}); 

  const fetchSweets = async () => {
    const res = await api.get("/sweets");
    setSweets(res.data);
    const qtyObj = {};
    res.data.forEach((s) => (qtyObj[s._id] = 1));
    setRestockQty(qtyObj);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleDelete = async (sweet) => {
    if (!window.confirm(`Are you sure you want to delete "${sweet.name}"?`)) return;
    try {
      await api.delete(`/sweets/${sweet._id}`);
      alert("Sweet deleted successfully!");
      fetchSweets();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete sweet");
    }
  };

  const handleRestock = async (sweet) => {
    const amount = restockQty[sweet._id];
    if (!amount || amount <= 0) {
      alert("Invalid restock amount!");
      return;
    }

    try {
      const res = await api.post(`/sweets/${sweet._id}/restock`, { amount });
      alert(res.data.message);
      fetchSweets();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to restock");
    }
  };

  const increaseQty = (id, max = 999) => {
    setRestockQty((prev) => ({
      ...prev,
      [id]: prev[id] + 1 <= max ? prev[id] + 1 : prev[id],
    }));
  };

  const decreaseQty = (id) => {
    setRestockQty((prev) => ({
      ...prev,
      [id]: prev[id] - 1 >= 1 ? prev[id] - 1 : prev[id],
    }));
  };

  return (
    <div className="p-6 bg-pink-50 min-h-screen">
      {!editSweet ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-pink-700">
              Admin | Manage Sweets
            </h2>

            <button
              onClick={() => setEditSweet({})}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition"
            >
              ➕ Add Sweet
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sweets.map((sw) => (
              <div
                key={sw._id}
                className="bg-white shadow-lg rounded-xl p-4 border border-pink-200"
              >
                <h3 className="text-pink-600 font-bold text-lg">{sw.name}</h3>
                <p className="text-gray-700 font-medium">₹{sw.price}</p>
                <p className="text-gray-600 text-sm mt-1">
                  Available: <span className="text-pink-700 font-bold">{sw.quantity}</span>
                </p>

                {/* Restock controls */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => decreaseQty(sw._id)}
                    className="px-2 py-1 text-white bg-pink-400 rounded disabled:bg-gray-300"
                    disabled={restockQty[sw._id] <= 1}
                  >
                    −
                  </button>
                  <span className="font-bold text-pink-700">{restockQty[sw._id]}</span>
                  <button
                    onClick={() => increaseQty(sw._id)}
                    className="px-2 py-1 text-white bg-pink-500 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRestock(sw)}
                    className="ml-auto bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Restock
                  </button>
                </div>

                {/* Edit & Delete */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditSweet(sw)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(sw)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete 🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <SweetForm
          sweet={Object.keys(editSweet).length === 0 ? null : editSweet}
          onSuccess={() => {
            setEditSweet(null);
            fetchSweets();
          }}
        />
      )}
    </div>
  );
}
