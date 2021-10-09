console.clear();
// import express
const express = require("express");
const connectDB = require("./config/connectDB");
// instance app
const app = express();
require("dotenv").config();

connectDB();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET , POST , DELETE , PUT , PATCH , OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type , Authorization');
  next();
})

const carRouter = require("./router/Car");
const rentRouter = require("./router/Rental");
const userRouter = require("./router/user");
const mailRouter = require("./router/Mail");

// router
// user
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/car", carRouter);
app.use("/rent", rentRouter);
app.use("/mail",mailRouter);

// PORT
const PORT = process.env.PORT;

// create server
app.listen(PORT, (err) =>
  err ? console.error(err) : console.log(`server is running on PORT ${PORT}`)
);
