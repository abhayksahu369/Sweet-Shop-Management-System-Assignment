const mongoose = require("mongoose");

const sweetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sweet name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Milk", "Dry", "Festival", "Bengali", "Special"],
      default: "Special",
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be at least ₹1"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description must be under 300 characters"],
    },


  },

  {
    timestamps: true, 
  }
);



module.exports = mongoose.model("Sweet", sweetSchema);
