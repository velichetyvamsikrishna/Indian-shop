import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import CategoryCardRenderer from "./Category-Card-Renderer";
import {  useGetProductsAPI } from "./../../api/productsAPI";
import { useEffect } from "react";

// Define styles for the component
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    media: {
      height: 300,
      width: "auto",
      margin: "auto",
    },
    cardContent: {
      textAlign: "left",
    },
    addButton: {
      marginTop: theme.spacing(2),
    },
    quantityControl: {
      display: "flex",
      alignItems: "center",
    },
    quantityInput: {
      width: 50,
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
    mainTitle: {
      textAlign: "center",
      marginBottom: theme.spacing(4),
    },
  })
);


const ShopByCategoriesRenderer: React.FC = () => {
  const classes = useStyles();

  const getProductsAPI = useGetProductsAPI();

  useEffect(() => {
		console.log("products "+JSON.stringify(getProductsAPI))
	}, [getProductsAPI]);


  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.mainTitle} gutterBottom>
        Shop By Categories
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={2}>
          <CategoryCardRenderer />
        </Grid>

        <Grid item xs={12} sm={2}>
          <CategoryCardRenderer />
        </Grid>

        <Grid item xs={12} sm={2}>
          <CategoryCardRenderer />
        </Grid>

        <Grid item xs={12} sm={2}>
          <CategoryCardRenderer />
        </Grid>

        <Grid item xs={12} sm={2}>
          <CategoryCardRenderer />
        </Grid>

        <Grid item xs={12} sm={2}>
          <CategoryCardRenderer />
        </Grid>
      </Grid>
    </div>
  );
};

export default ShopByCategoriesRenderer;
