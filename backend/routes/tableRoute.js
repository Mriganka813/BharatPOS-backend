const express = require("express");
const router = express.Router();
var tablemodel = require("../models/orderedItem");
const { response } = require("../app");

router.get("/api/table", async (req, res) => {
  try {
    // Fetch data based on the query parameters
    const data = await tablemodel.find({});

    const arr = [];
    for (const order of data) {
      for (const item of order.items) {
        const dataInfo = {
          date: order.createdAt.toLocaleDateString("en-US"),
          //   productId: item.productId,
          orderId: order._id,
          orderStatus: item.status,
          sellerName: item.sellerName,
          price: parseFloat(item.productPrice),
          status: item.status,
          productName: item.productName,
          quantity: item.quantity,
          total: item.quantity * item.price,
        };
        arr.push(dataInfo);
      }
    }
    // Send the fetched data as the response
    // res.json(arr);
    return res.render("table", {
      data: arr,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

module.exports = router;
