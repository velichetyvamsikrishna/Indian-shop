import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  TextField,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import SwipeableViews from "react-swipeable-views";

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
  })
);

// Define the interface for the Product component props
interface IProductDetailsRenderer {
  name: string;
  description: string;
  images: string[]; // An array of image URLs
  price: number;
}

// Product component
const ProductDetailsRenderer: React.FC<IProductDetailsRenderer> = ({
  name,
  description,
  images,
  price,
}) => {
  const classes = useStyles();
  const [quantity, setQuantity] = useState(1);
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveStep(
      (prevActiveStep) => (prevActiveStep - 1 + images.length) % images.length
    );
  };

  const handleAddToCart = () => {
    // Add your logic here to handle adding the product to the cart
    console.log(`Added ${quantity} ${name} to cart`);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value);
    if (isNaN(value)) {
      value = 0;
    }
    setQuantity(value);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <SwipeableViews index={activeStep}>
            {images.map((imageUrl, index) => (
              <div key={index}>
                <img
                  className={classes.media}
                  src={imageUrl}
                  alt={`${name}-image-${index}`}
                />
              </div>
            ))}
          </SwipeableViews>
          <IconButton onClick={handlePrev}>
            <RemoveIcon />
          </IconButton>
          <IconButton onClick={handleNext}>
            <AddIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h5" gutterBottom>
              {name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {description}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Price: ${price}
            </Typography>
            <div className={classes.quantityControl}>
              <IconButton aria-label="reduce" onClick={decreaseQuantity}>
                <RemoveIcon />
              </IconButton>
              <TextField
                className={classes.quantityInput}
                variant="outlined"
                size="small"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: "1", step: "1" }}
              />
              <IconButton aria-label="increase" onClick={increaseQuantity}>
                <AddIcon />
              </IconButton>
            </div>
            <Button
              variant="contained"
              color="primary"
              className={classes.addButton}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </CardContent>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductDetailsRenderer;
