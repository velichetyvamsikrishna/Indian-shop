import React from "react";
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

const BestSellersRenderer: React.FC = () => {
  const classes = useStyles();
  const cards = [1, 2, 3, 4, 5, 6]; // Placeholder for card content
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(cards.length - 4, prevIndex + 1));
  };

  return (
    <Container maxWidth="false" >
      <div className={classes.root}>
        <Typography variant="h4" className={classes.mainTitle}>
          Best Sellers
        </Typography>
        <div className={classes.cardContainer}>
          <Grid container spacing={4}>
            {cards.slice(currentIndex, currentIndex + 4).map((card, index) => (
              <Grid key={index} item xs={12} sm={9} md={6} lg={3}>
                <GroceryItemCardRenderer />
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
