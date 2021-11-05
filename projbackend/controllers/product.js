const  Product=require("../models/product")
const formidable=require("formidable")
const _ =require("lodash")
const fs=require("fs")
//const { escapeRegExp } = require("lodash")

exports.getProductById=(req,res,next,id)=>{
    Product.findById(id).exec((err,product)=>{
        if(err||!product){
           return  res.status(400).json({
               error:"No product in db"
           })
        }
        req.product=product;
        next();
    })

}

exports.getProduct=(req,res)=>{
    req.product.photo=undefined
    return res.json(req.product);
}


//middleware
exports.photo=(req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    
    }
    next();
}

exports.createProduct=(req,res)=>{
    //
    let form=new formidable.IncomingForm();
    form.keepExtensions= true;


    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            });
        }
        //destructure the fields
        const {name,description,pricee,category,stock}=fields;

        if(
            !name||
            !description||
            !pricee||
            !category||
            !stock
             )
         {
            return res.status(400).json({
                error: "please include all fields"
            });
        }
       
        let product = new Product(fields)

        //handle file here
       
        if(file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    error: "file size too big!"
                })
            }
            console.log(fs.readFileSync(file.photo.path));
            console.log(file.photo.type);
  
        product.photo.data=fs.readFileSync(file.photo.path);
        product.photo.contentType=file.photo.type;
        }
        console.log("product is",product);


        // save to the db
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:"saving t shirt in db failed"
                })
            }
            res.json(product);
        })
    })
}

exports.deleteProduct= (req,res)=>{
    let product = req.product;
    console.log("lllll",product);
    product.remove((err,deletedproduct)=>{
        if(err){
            res.status(400).json({
                error:"failed to delete the product"
            })
        }
        res.json({
            message : "deletion is succesful",
            deletedproduct
        })
    })

}


exports.updateProduct=(req,res)=>{
    let form=new formidable.IncomingForm();
    form.keepExtensions= true;


    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            });
        }
     
        //updation code
        let product = req.product;
        product=_.extend(product,fields)
        // console.log(product);
        //handle file here
       
        if(file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    error: "file size too big!"
                })
            }
          
  
        product.photo.data=fs.readFileSync(file.photo.path);
        product.photo.contentType=file.photo.type;
        }
       //console.log(product);

        // save to the db
        product.save((err,updatedproduct)=>{
            if(err){
                return res.status(400).json({
                    error:"updation of product failed"
                })
            }
            res.json(updatedproduct);
        })
    })
}

//product listing
exports.getAllProducts=(req,res)=>{
     let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy =req.query.sortBy? req.query.sortBy:"_id";

    Product.find().
    select("-photo").
    sort([[sortBy,"asc"]]).
    limit(limit).
    exec((err,products)=>{
        if(err){
            return res.status(400).json({
                error: "No product found"
            });
        }
        res.json(products);
    })
//    Product.find().
//    select("-photo").
//    populate("category").
//    sort([[sortBy,"asc"]]).
//    limit(limit).
//    exec((err,products)=>{
//        if(err){
//            return res.status(400).json({
//                error: "No product FOUND"
//            })
//        }
//        res.json(products)
//    })
}

exports.updateStock=(req,res,next)=>{


    let myOperations=req.body.order.products.map(prod=>{
        return {
            updateOne:{
                filter: {_id: prod._id},
                update:{$inc:{stock: -prod.count,sold: +prod.count}}
            }
        }
    })
    Product.bulkWrite(myOperations, {} , (err,products)=>{
        if(err){
            return res.status(400).json({
                 error: "Bulk operations failed"
                })
           
        }
        next();
    })
}

exports.getAllUniqueCategories =(req,res)=>{
    Product.distinct("category",{},(err,category)=>{
        if(err){
            return res.status(400).json({
                eror:" No category found"
            })
        }
        res.json(category)
    })
}