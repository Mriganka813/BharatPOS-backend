const express = require("express");
const router = express.Router();
const puppeteer = require('puppeteer');
// const orderItem = [
//     {
    
//     price: 30,
//     quantity:5,
//     product:{
//         name:"Product 1",
//         baseSellingPriceGst:60,// if gst != null
//         sellingPrice:60,  // if !gst or gst == null
//         gstRate:10,              // in Rs if null do not add
//     }
//   },
//   {
//     price: 30,
//     quantity:5,
//     product:{
//         name:"Product 2zakjlhdkla shdkld ",
//         baseSellingPriceGst:60,// if gst != null
//         sellingPrice:60,  // if !gst or gst == null
//         gstRate:10, 
//     }
//   },
//   {
//     price: 30,
//     quantity:5,
//     product:{
//         name:"Product 3",
//         baseSellingPriceGst:60,// if gst != null
//         sellingPrice:60,  // if !gst or gst == null
//         gstRate:10, 
//     }
//   },
// ];

// const invoice = "66546";

// const address ={
//     locality:"value",
//     city:"Mandla",
//     state:"MP",
// }

// const companyName="My company"
// const email = "rpbarmaiya@gmail.com"
// const phone=7000061754




router.get('/invoice',async(req,res)=>{
  
  const {orderItem,invoice,address,companyName,email,phone,date} = req.body

   try{
    return res.render('invoice',{
        companyName,
        email,
        phone,
        address,
        invoice,
        orderItem,
        date


    })
   }catch(err){
    console.log(err);
   }
})
// ammt = (rate+gst)*qty
// subTotal = total of qty * rate
// gsttotal = qty * gst
// bet total = gst+subtotal



module.exports = router;
