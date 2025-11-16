import { useState, useEffect } from "react";
import api from "../api/api";

export default function SweetForm({ sweet, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    image: "",
    description: "",
  });

  const isEdit = Boolean(sweet);

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
        image: sweet.image,
        description: sweet.description,
      });
    }
  }, [sweet, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await api.put(`/sweets/${sweet._id}`, form);
        alert("Sweet updated successfully!");
      } else {
        await api.post("/sweets", form);
        alert("Sweet added successfully!");
      }

      setForm({
        name: "",
        category: "",
        price: "",
        quantity: "",
        image: "",
        description: "",
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to save sweet!");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-xl mt-8 border border-pink-200">
      <h2 className="text-2xl font-bold text-pink-700 mb-4 text-center">
        {isEdit ? "✏️ Update Sweet" : "➕ Add New Sweet"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[ 
          { label: "Name", name: "name", required: true },
          { label: "Price (₹)", name: "price", type: "number", required: true },
          { label: "Quantity", name: "quantity", type: "number", required: true },
          { label: "Image URL", name: "image", required: false }, // <-- NOT REQUIRED
        ].map((field) => (
          <input
            key={field.name}
            type={field.type || "text"}
            placeholder={field.label}
            name={field.name}
            value={form[field.name]}
            onChange={handleChange}
            {...(field.required && { required: true })}
            className="w-full p-3 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        ))}

        {/* Category */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border border-pink-300 focus:ring-2 focus:ring-pink-500"
        >
          <option value="">Select Category</option>
          <option value="Milk">Milk</option>
          <option value="Dry">Dry</option>
          <option value="Festival">Festival</option>
          <option value="Bengali">Bengali</option>
          <option value="Special">Special</option>
        </select>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-3 rounded-lg border border-pink-300 focus:ring-2 focus:ring-pink-500"
        />

        <button
          type="submit"
          className="w-full py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition shadow-lg"
        >
          {isEdit ? "Update Sweet 🍭" : "Add Sweet 🍬"}
        </button>
      </form>
    </div>
  );
}
