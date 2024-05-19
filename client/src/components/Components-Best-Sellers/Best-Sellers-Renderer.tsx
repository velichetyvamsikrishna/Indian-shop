import React, {useEffect, useState} from "react";
import {
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid,
  Container
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import GroceryItemCardRenderer from "../Grocery-Item-Card/Grocery-Item-Card-Renderer";
import { useStyles } from "./Best-Sellers.styles";
//apis
import { useBestSellersAPI } from "../../api/productsAPI";

// discount:bestSeller.bestSeller.Discount,
//     title: bestSeller.bestSeller.Name,
//     pricePerVolume: bestSeller.bestSeller.PricePerUnitQuantity,
//     currentPrice: bestSeller.bestSeller.DiscountedPrice,
//     originalPrice: bestSeller.bestSeller.Price,

const BestSellersRenderer: React.FC = () => {
  const classes = useStyles();
  const [cards,setCards] = useState<any[]>([]) // Placeholder for card content
  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(()=>{
    updateBestSellers();
  },[]);
  const updateBestSellers=async ()=>{
    const bestSellers=await useBestSellersAPI();
    console.log(bestSellers);
    setCards(bestSellers);
  }
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(cards.length - 4, prevIndex + 1));
  };

  return (
    <Container>
      <div className={classes.root}>
        <Typography variant="h4" className={classes.mainTitle}>
          Best Sellers
        </Typography>
        <div className={classes.cardContainer}>
          <Grid container spacing={4}>
            
            {cards.slice(currentIndex, currentIndex + 4).map((card, index) => (
              <Grid key={index} item xs={12} sm={9} md={6} lg={3}>
                <GroceryItemCardRenderer product={card}/>
              </Grid>
            ))}
          </Grid>
          {cards.length > 4 && (
            <div className={classes.arrowsContainer}>
              <IconButton
                className={classes.arrowButton}
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton
                className={classes.arrowButton}
                onClick={handleNext}
                disabled={currentIndex === cards.length - 4}
              >
                <ArrowForwardIcon />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default BestSellersRenderer;
