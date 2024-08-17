const express=require("express");
const cors=require("cors");
const mainRouter=require("./routes/index");
const dotenv = require("dotenv");
const app=express(); 
const mongoose=require("mongoose");

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
dotenv.config();



app.use("/api/v1",mainRouter);

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("database is connected successfully!");
    } catch (err) {
      console.log(err);
    }
  };
  
  app.get("/", (req, res) => {
    res.json("Server is up and running");
  });
  
  app.listen(process.env.PORT, () => {
    connectDB();
    console.log("Server is running on port: " + process.env.PORT);
  });