import React, { useState } from "react";
import { Grid, Typography, Container } from "@material-ui/core";
import CategoryCardRenderer from "./Category-Card-Renderer";
import { shopByCategory } from "./Shop-By-Category.styles";

const ShopByCategoriesRenderer: React.FC = () => {
  const classes = shopByCategory();

  return (
    <Container maxWidth="lg" >
      <div className={classes.root}>
        <Typography variant="h4" className={classes.mainTitle} gutterBottom>
          Shop By Categories
        </Typography>
        <Grid container spacing={2}>
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
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <CategoryCardRenderer />
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default ShopByCategoriesRenderer;
