const express=require("express");
const app=express();
const cors=require("cors")
const authRoutes=require("./routes/auth.route")


require("dotenv").config();


app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);

module.exports=app;