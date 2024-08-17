const express=require("express");
const cors=require("cors");
const mainRouter=require("./routes/index");
const dotenv = require("dotenv");
const app=express(); 

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
dotenv.config();



app.use("/api/v1",mainRouter);

app.listen(3000);