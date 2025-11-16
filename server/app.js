const express=require("express");
const app=express();
const cors=require("cors")
const authRoutes=require("./routes/auth.route")
const sweetRoutes=require("./routes/sweet.route")
const inventoryRoutes=require("./routes/inventory.route")


require("dotenv").config();


app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/sweets",sweetRoutes);
app.use("/api/sweets",inventoryRoutes);


module.exports=app;