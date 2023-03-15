import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import path from "path";
import cloudinary from "cloudinary";
var busboy = require("connect-busboy");
import cors from "cors";
import * as dotenv from "dotenv";
import crypto from "crypto";
// Route Imports
import subscribedUsersModel from "./models/subscribed_user";
import { V1Router } from "./routes/routes";
dotenv.config();

// Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(busboy());
app.use(cors());

app.get("/privacy-policy", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "privacy-policy.html"));
});
app.get("/terms-and-condition", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "terms_and_conditions.html"));
});
// this is webhook for razorpay.
app.post("/verification", (req, res) => {
  const secret = "8432451555";
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    const email1 = req.body.payload.payment.entity.email;
    const phoneNumber1 = req.body.payload.payment.entity.contact;
    const amount1 = Number(req.body.payload.payment.entity.amount) / 100;
    // console.log("email1", email1);
    // console.log("phoneNumber1", phoneNumber1);
    // console.log("amount1", amount1);
    // expireAt: new Date(Date.now() + 2419200000),
    const trimPhone = Number(phoneNumber1.substring(3));
    subscribedUsersModel.create({
      email: email1,
      phoneNumber: trimPhone,
      expireAt: new Date(Date.now() + 2419200000),
    });
    res.json({
      status: "ok",
    });
  } else {
    res.json({
      status: "error",
    });
  }
});

app.use("/api/v1", V1Router);
// Middleware for Errors
// app.use(errorMiddleware);

export default app;
