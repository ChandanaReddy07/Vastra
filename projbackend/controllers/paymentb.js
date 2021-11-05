const braintree = require("braintree");


const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "dc75ctkdp72s3csg",
  publicKey: "6n6mgg7dfksb5s4f",
  privateKey: "e3bbc6f05fe40954f7321e6004562ec4"
});


exports.getToken=(req,res)=>{
  console.log("token")
    gateway.clientToken.generate({} , (err, response) => {
       if(err){
        res.status(500).send(err);
          }
       else{
      res.send(response);
       }
      });
}

exports.processPayment=(req,res)=>{
    //
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountfromclient=req.body.amount;
    gateway.transaction.sale({
        amount: amountfromclient,
        paymentMethodNonce: nonceFromTheClient,
     
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
          if(err){
             res.status(500).json(error)
          }
          else{
              res.json(result);
          }
      });

}