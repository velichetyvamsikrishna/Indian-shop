import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Grid, Typography, Container } from "@material-ui/core";
import BrandCardRenderer from "./Brand-Card-Renderer";

// Define styles for the component
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      paddingTop: 50,
      paddingBottom: 150,
      paddingLeft: 40,
      paddingRight: 40,
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

const ShopByBrandRenderer: React.FC = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" >
      <div className={classes.root}>
        <Typography variant="h4" className={classes.mainTitle} gutterBottom>
          Shop By Brands
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <BrandCardRenderer />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <BrandCardRenderer />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <BrandCardRenderer />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <BrandCardRenderer />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <BrandCardRenderer />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <BrandCardRenderer />
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default ShopByBrandRenderer;
