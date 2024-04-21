import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardMedia, CardContent, CardActions, Button, Typography, IconButton, TextField } from '@material-ui/core';
import { useStyles } from "./Grocerty-Item-Card.styles";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const GroceryItemCardRenderer: React.FC = () => {
  const item = {
    discount: 20,
    title: '250gms India Gate Jeera Rice',
    pricePerVolume: '2.50 EUR / Kilogram',
    currentPrice: 90,
    originalPrice: 120,
  };
  const image = "https://via.placeholder.com/216x216";
  const classes = useStyles();

  return (
    <Card className={classes.cardStyles}>
      <div className={classes.container1}></div>
      <div className={classes.container2}>
        <div className={classes.overlay}></div>
        <div className={classes.imageContainer}>
          <div className={classes.image}>
            <img src={image} alt="Product" />
          </div>
        </div>
      </div>
      <div className={classes.discountContainer}>
        <div className={classes.discountText}>{item.discount}% OFF</div>
      </div>
      <CardContent className={classes.title}>{item.title}</CardContent>
      <CardContent className={classes.price}>{item.pricePerVolume}</CardContent>
      <CardContent className={classes.priceContainer}>
        <Typography className={classes.priceValue}>{item.currentPrice} {item.originalPrice}</Typography>
      </CardContent>
      <CardActions className={classes.actionButtonsContainer}>
        <IconButton className={classes.cardItemIcons}>
          <RemoveIcon />
        </IconButton>
        <TextField
          className={classes.cardItemTextField}
          variant="outlined"
          size="small"
        />
        <IconButton className={classes.cardItemIcons}>
          <AddIcon />
        </IconButton>
        <div className={classes.addButton}>
          <div className={classes.addText}>Add</div>
        </div>
      </CardActions>
      {/* <CardActions className={classes.actionButtonsContainer}>
        <div className={classes.quantityContainer}>
          <div className={classes.quantityOverlay}></div>
          <div className={classes.quantityText}>1</div>
          <div className={classes.quantityOverlay}></div>
          <div className={classes.quantityOverlay}></div>
          <div className={classes.quantityOverlay}></div>
          <div className={classes.quantityOverlay}></div>

        </div>
        
      </CardActions> */}
    </Card>
  );
};

export default GroceryItemCardRenderer;
