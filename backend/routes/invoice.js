const express = require("express");
const router = express.Router();


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
