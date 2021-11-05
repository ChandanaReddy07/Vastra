
// const stripe= require("stripe")("sk_test_51Ib8hbSGMiV0IdsAQebqvmXaqsnTJQg9hKAZGEL4WzlsWMexCfPNoqk8NTWejcc4Zmb0XkXF8bRilAXfG1TfDdel00gb3eY3wJ")
// const uuid = require("uuid/v4")



// exports.makepayment=(req,res)=>{
   
//       //  res.send("lololo")

//     const {products,token}= req.body;
//     console.log("PRODUCTs",products);
    
//     let amount=0;
//     products.map(p=>{
//          amount=amount+p.pricee;
//      })
    
//      const idempotencyKey=uuid()

//      return stripe.customers.create({
//          email: token.email,
//          source: token.id
//      })
//      .then(customer=>{
//          stripe.charge.create({
//             amount: amount*100,
//             currency:'usd',
//             customer:customer.id,
//             receipt_email: token.email,
//             description: "a test account",

//             shipping:{
//                 name:token.card.name,
//                 address:{
//                    line1: token.card.address_line1,
//                    line2: token.card.address_line2,
//                    city: token.card.address_city,
//                    country:token.card.address_country,
//                    postal_code: token.card.address_zip
//                 }
//             }
//          },{idempotencyKey})
//      })
//      .then(result=>res.status(200).json(result))
//      .catch(err=>console.log(err))

//    };