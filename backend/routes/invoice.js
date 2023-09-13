const express = require("express");
const router = express.Router();
const ejs = require('ejs'); 
const Invoice = require('../models/invoice')

router.post('/invoice',async(req,res)=>{
  
  const {orderItem,invoice,address,companyName,email,phone,date} = req.body

  

   try{

    const newInvoice= new Invoice({
      companyName,
      email,
      phone,
      address,
      invoice,
      orderItem,
      date
})

await newInvoice.save();
console.log(newInvoice);
    return res.send(newInvoice._id)
   }catch(err){
    console.log(err);
   }
})

//  6501a0fcf99014efc41ca05f

router.get('/genrate/:id', async (req, res) => {
  const {id} = req.params;

  try {
    const invoiceid = await Invoice.findById(id)

    const  orderItem = invoiceid.orderItem
    const   companyName = invoiceid.companyName 
    const   email = invoiceid.email
    const   phone = invoiceid.phone
    const   address = invoiceid.address
    const   invoice = invoiceid.invoice
    const   date = invoiceid.date


    return res.render('invoice',{
      companyName,
      email,
      phone,
      address,
      invoice,
      orderItem,
      date


  })

  } catch (err) {
    console.log(err);
  }
});

module.exports = router;



module.exports = router;
