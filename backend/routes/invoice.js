const express = require("express");
const router = express.Router();
const ejs = require('ejs'); 

router.post('/invoice5',async(req,res)=>{
  
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


router.post('/invoice', async (req, res) => {
  const { orderItem, invoice, address, companyName, email, phone, date } = req.body;

  try {
    // Render the 'invoice.ejs' file with the provided data
    const htmlContent = await ejs.renderFile('views/invoice.ejs', {
      companyName,
      email,
      phone,
      address,
      invoice,
      orderItem,
      date
    });

    // Set the Content-Type header to specify that we are sending HTML content
    res.setHeader('Content-Type', 'text/html');

    // Send the HTML content as the response
    res.send(htmlContent);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;



module.exports = router;
