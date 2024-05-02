const productModel =require("./productsModel.js");

const getProducts=async(filterObject,options={})=>{
    //Dep: productModel
    const query=productModel.find(filterObject);
    if(options.sort) query.sort(options.sort);
    if(options.limit) query.limit(options.limit);
    return await query.exec();
  }

const getProductCategories=async(options={})=>{
    //Dep: productModel
    const query=productModel.find({},"CAT_ID CAT_NAME");
    if(options.sort) query.sort(options.sort);
    const result=await query.exec();
    var uniquecategoryObjects=[]
    const uniqueCategoryIds=[];
    for (let categoryObject of result){
        const id=categoryObject.CAT_ID;
        const name=categoryObject.CAT_NAME;
        if(uniqueCategoryIds.indexOf(id)===-1){
        uniqueCategoryIds.push(id);
        uniquecategoryObjects.push({CAT_ID:id,CAT_NAME:name});
        }
    }
     uniquecategoryObjects=[{"CAT_ID":1,"CAT_NAME":"Rice Products"},{"CAT_ID":2,"CAT_NAME":"Flour Products"},{"CAT_ID":3,"CAT_NAME":"Pulses and Spices"},{"CAT_ID":4,"CAT_NAME":"Beverages"},{"CAT_ID":5,"CAT_NAME":"Oil and Ghee"},{"CAT_ID":6,"CAT_NAME":"Household"},{"CAT_ID":7,"CAT_NAME":"Deal of the Day"},{"CAT_ID":8,"CAT_NAME":"Discounts"}]
    
    return uniquecategoryObjects;
}

const getBestSellers=async ()=>{
    //Dep: productModel
    return await productModel.find({Labels:"Bestsellers"});
}

const insertProduct=async (productObject)=>{
    //Dep: productModel
    try{
        const product=await productModel.create(productObject);
        return {status:"success",newProductId:product.PROD_ID}
    }catch (e){
        console.log(e);
        return {status:"fail",error:e}
    }
}
const updateProduct=async (productId, modifyObject)=>{
    try{
        const products=await productModel.updateOne({PROD_ID:productId},modifyObject)
        if(products.acknowledged)
            return {status:"success"}
        else return {status:"fail"}
    }catch (e){
        return {status:"fail"}
    }
}
const deleteProduct=async (productId)=>{
    try{
        const deletedCount=(await productModel.deleteOne({PROD_ID:productId})).deletedCount;
        if(deletedCount>0) return {status:'success',}
        else return {status:'fail',errorMessage:"couldn't find the productId"}
    }catch{
        return {status:'fail',errorMessage:'unknownerror'};
    }
}
module.exports={insertProduct, getBestSellers, getProductCategories, getProducts, updateProduct, deleteProduct};