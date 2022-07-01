const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cloudinary = require("cloudinary");
const fs = require("fs");
var busboy = require("connect-busboy");
const cors = require("cors");
// const fs=require("fs");

const errorMiddleware = require("./middleware/error");
const logFile = fs.createWriteStream("./logfile.log", { flags: "w" }); //use {flags: 'w'} to open in write mode

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(busboy());
app.use(cors());

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
const report = require("./routes/reportRoute");
const consumer = require("./routes/consumerRoute");
const payment = require("./routes/paymentRoutes");
var corsOptions = {
  origin: [
    "http://localhost:5500",
    "http://localhost:5000",
    "http://127.0.0.1:5500",
  ],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Accept, Content-Type")
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5500")
  res.setHeader("Access-Control-Allow-Credentials", true)
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS, PATCH")
  next();
})

app.get("/privacy-policy", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "privacy-policy.html"));
});
app.get("/terms-and-condition", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "terms_and_conditions.html"));
});

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", admin);
app.use("/api/v1", party);
app.use("/api/v1", income);
app.use("/api/v1", sales);
app.use("/api/v1", purchase);
app.use("/api/v1", expense);
app.use("/api/v1", report);
app.use("/api/v1/consumer",consumer);
app.use("/api/v1/payment",payment);

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  // res.send("connected");
  res.render("index.ejs");
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
