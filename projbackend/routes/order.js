const express=require("express")
const router=express.Router();
const {isSignedIn,isAdmin,isAuthenticated} = require("../controllers/auth")
const {getUserById,pushOrderInPurchaseList} = require("../controllers/user")
const {createOrder,getAllOrders,updateStatus,getOrderStatus,getOrderById}= require("../controllers/order")
const {updateStock} = require("../controllers/product");
const { model } = require("../models/user");


//params
router.param("userId",getUserById);
router.param("orderId",getOrderById)


//Actual Routs
//create
router.post("/order/create/:userId",isSignedIn,isAuthenticated,pushOrderInPurchaseList,updateStock,createOrder)

//read
router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders)

//status o order
router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus)
router.put("/order/:order/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus)

module.exports=router;
