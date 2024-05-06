const express = require("express");
const { getBestSellers, getProductCategories, getProducts } =require("../DB/ProductsModule/productsDB.js");
const  {processAddProduct, processUpdate, processDelete, processGetProductsRequest, processGetCategoriesRequest}  =require( "../DB/ProductsModule/productsMiddleware.js");

const router = express.Router();

//Get All products
router.get("/all",async (req,res)=>{
  console.log("get request")
  try{
    const products=await getProducts({});
    res.status(200).json({status:"success",products:products});
  }catch (err){
      res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/allcategories",async (req,res)=>{
  try{
    const categories=await getProductCategories();
    res.status(200).json({status:"success",categories:categories});
  }catch (err){
      res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/allcategories/:order",async (req,res)=>{
  try{
    const categories=await getProductCategories({sort:{CAT_ID:req.params.order}});
    res.status(200).json({status:"success",categories:categories});
  }catch (err){
      res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/bestsellers",async (req,res)=>{
  try{
    const products=await getBestSellers({});
    res.status(200).json({status:"success",products:products});
  }catch (err){
      res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/bycategoryid/:id",async (req,res)=>{
  try{
    const products=await getProducts({CAT_ID:req.params.id});
    if(products.length>0)
      res.status(200).json({status:"success",products:products});
    else
      res.status(200).json({status:"nil",products:products});
  }catch (err){
      res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/byproductid/:id",async (req,res)=>{
  try{
    const products=await getProducts({PROD_ID:req.params.id});
    if(products.length>0)
      res.status(200).json({status:"success",products:products});
    else
      res.status(200).json({status:"nil",products:products});
  }catch (err){
      res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/add",processAddProduct, (req,res)=>{
  if(req.error){
    if(req.error.code===11000){
      res.status(200).json({status:"fail",errorMessage:"Duplicate Product Id provided."});
    }
  }
  else{
    res.status(200).json({"status":"success",newId:req.newProductId});
  }
  res.end();
});
router.post("/updateproduct",processUpdate,(req,res)=>{
  if(req.status==='success') res.status(200).json({'status':'success'});
  else res.status(200).json({'status':'fail'});
  res.end();
})
router.post("/delete",processDelete,(req,res)=>{
  res.status(200).json(req.result);
  res.end();
})
//getCategories: {id,name}, getBestSellers: , getProductsByCategoryId, getProductByProductId, getProducts : addProduct, editProduct, deleteProduct,
//post requests
//=>/products/getproducts=>{filterType:string (all,bestSellers,byCategoryId,byProductId),filterValue:string,sortby:{fieldName:'asc' || 'desc'},limit:{from:,to}}
router.post("/getproducts",processGetProductsRequest,(req,res)=>{
  const products=req.products;
  if(products.length>0)
    res.status(200).json({'status':'success',products:products});
  else res.status(404).json({'status':'fail',products:[]});
})
//=>/products/categories => {sort:asc/desc}
router.post("/getcategories",processGetCategoriesRequest,(req,res)=>{
  const categories=req.categories || [];
  if(categories.length>0)
    res.status(200).json({'status':'success',categories:categories});
  else res.status(404).json({'status':'fail',categories:[]});
  res.end();
})
module.exports = router;
