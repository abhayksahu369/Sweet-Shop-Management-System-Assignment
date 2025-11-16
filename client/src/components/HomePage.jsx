import React, { useEffect, useState } from "react";
import api from "../api/api";
import SweetCard from "./SweetsCard";

const HomePage = () => {
  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchSweets = async () => {
    try {
      const response = await api.get("/sweets");
      setSweets(response.data);
    } catch (err) {
      console.log("Error fetching sweets:", err);
    }
  };

  const applyFilters = async () => {
    let query = `/sweets/search?`;

    if (search) query += `name=${search}&`;
    if (category) query += `category=${category}&`;
    if (minPrice) query += `minPrice=${minPrice}&`;
    if (maxPrice) query += `maxPrice=${maxPrice}&`;

    try {
      const response = await api.get(query);
      setSweets(response.data);
    } catch (err) {
      console.log("Filter Error:", err);
    }
  };

  useEffect(() => {
    if (search || category || minPrice || maxPrice) {
      applyFilters();
    } else {
      fetchSweets();
    }
  }, [search, category, minPrice, maxPrice]); 

  return (
    <div className="p-6 bg-pink-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-pink-700 text-center mb-6">
        🍬 Sweet Delights Store 🍬
      </h1>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-3 justify-center mb-6 bg-white p-5 rounded-xl shadow-lg">

        {/* Search Name */}
        <input
          type="text"
          placeholder="Search sweets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-pink-300 rounded-lg outline-none w-48"
        />

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-pink-300 rounded-lg outline-none"
        >
          <option value="">All Categories</option>
          <option value="Milk">Milk</option>
          <option value="Dry">Dry</option>
          <option value="Festival">Festival</option>
          <option value="Bengali">Bengali</option>
          <option value="Special">Special</option>
        </select>

        {/* Price Filter */}
        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="px-4 py-2 border border-pink-300 rounded-lg outline-none w-24"
        />

        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="px-4 py-2 border border-pink-300 rounded-lg outline-none w-24"
        />

      </div>

      {/* All Sweets */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sweets.map((sweet) => (
          <SweetCard key={sweet._id} sweet={sweet} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
