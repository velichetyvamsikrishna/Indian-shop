import React, { useState,useEffect } from "react";
import { Grid, Typography, Container } from "@material-ui/core";
import CategoryCardRenderer from "./Category-Card-Renderer";
import { shopByCategory } from "./Shop-By-Category.styles";
import { useGetAllCategoriesAPI, useCategoriesAPI } from "./../../api/productsAPI";
import { useNavigate } from "react-router-dom";

const ShopByCategoriesRenderer: React.FC = () => {
  const navigate=useNavigate();
  const classes = shopByCategory();
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    // const response = await useGetAllCategoriesAPI();
    const response = await useCategoriesAPI();
    // const data = await response.data;
    setCategories(response);
  };
  const handleCategoryShop=(category:any)=>{
    // console.log(category.category.CAT_ID);
    navigate(`/app/productList/category/${category.category.CAT_ID}`);
  }
  return (
    <Container maxWidth="lg" >
      <div className={classes.root}>
        <Typography variant="h4" className={classes.mainTitle} gutterBottom>
          Shop By Categories
        </Typography>
        <Grid container spacing={2}>
          {categories.map((category) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={2} onClick={()=>{handleCategoryShop({category})}} style={{cursor:"pointer"}}>
                <CategoryCardRenderer data={category} />
              </Grid>
            );
          })}


          {/* <Grid item xs={12} sm={6} md={4} lg={2}>
            <CategoryCardRenderer />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <CategoryCardRenderer />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <CategoryCardRenderer />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <CategoryCardRenderer />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <CategoryCardRenderer />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <CategoryCardRenderer />
          </Grid> */}
        </Grid>
      </div>
    </Container>
  );
};

export default ShopByCategoriesRenderer;

