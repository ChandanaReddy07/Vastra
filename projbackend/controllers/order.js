const { eq } = require("lodash");
const {Order,ProductCart}= require("../models/order");

exports.getOrderById=(req,res,next,id)=>{
    Order.findById(id)
    .populate("products.product","name price")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"No order found in Db"
            })
        }
        req.order= order;
        next();
    })
}

exports.createOrder= (req,res)=>{
    req.body.order.user=req.profile;
    const order=new Order(req.body.order)
    order.save((err,order)=>{
  
                if(err){
                    return res.status(400).json({
                        error: "failed to save order in db"
                    })
                }
                res.json(order);
            })
 }
  

exports.getAllOrders=(req,res)=>{
    Order.find({user:req.profile._id})
    .populate("user","_id ")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"No order found in db"
            });
        }
        res.json(order);
    })
}

exports.updateStatus=(req,res)=>{
    res.json(Order.schema.path("status".enumValues))
}
exports.getOrderStatus=(req,res)=>{
    Order.update(
        {
            _id:req.body.orderId
        },
        {$set: {status: req.body.status}},
    (err,order)=>{
        if(err){
        return res.status(400).json({
            error: "cannot update order status"
        })}
        res.json(order)

    }
    )
}