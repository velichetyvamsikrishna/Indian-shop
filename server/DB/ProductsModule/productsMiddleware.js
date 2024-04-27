const { insertProduct, updateProduct, deleteProduct } = require("./productsDB.js");

const processAddProduct=async (req,res,next)=>{
    const result=await insertProduct(req.body.productObject);
    if(result.status==="success"){
        req.newProductId=result.newProductId;
    }
    else{
        req.error=result.error;
    }
    next();
}
const processUpdate=async (req,res,next)=>{
    const updateObject=req.body.updateObject;
    if('PROD_ID' in updateObject) return res.status(404).json({'status':'fail','errorMessage':'cannot modify PROD_ID'})
    const result=await updateProduct(req.body.productId,req.body.updateObject);
    if(result.status="success") req.status='success'
    else req.status="fail";
    next();
}
const processDelete=async (req,res,next)=>{
    req.result=await deleteProduct(req.body.productId);
    next();
}
module.exports={processAddProduct, processUpdate, processDelete};