const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
var busboy = require("connect-busboy");
// const fs=require("fs");

const errorMiddleware = require("./middleware/error");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(busboy());

// Set EJS as templating engine
app.set("view engine", "ejs");

// Route Imports
const product = require("./routes/inventoryRoute");
const user = require("./routes/userRoute");
const admin = require("./routes/adminRoute");
const party = require("./routes/partyRoute");
const income = require("./routes/incomeRoute");
const purchase = require("./routes/purchaseRoute");
const sales = require("./routes/salesRoute");
const expense = require("./routes/expenseRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", admin);
app.use("/api/v1", party);
app.use("/api/v1", income);
app.use("/api/v1", sales);
app.use("/api/v1", purchase);
app.use("/api/v1", expense);

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  // res.send("connected");
  res.render("index.ejs");
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
