import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import GroceryItemCardRenderer from "../Grocery-Item-Card/Grocery-Item-Card-Renderer";

// Define styles for the component
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    mainTitle: {
      textAlign: "center",
      marginBottom: theme.spacing(4),
    },
    cardContainer: {
      position: "relative",
    },
    card: {
      minWidth: 275,
      textAlign: "center",
      height: "100%",
      transition: "transform 0.3s ease-in-out",
    },
    arrowsContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: theme.spacing(2),
    },
    arrowButton: {
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      borderRadius: "50%",
      padding: theme.spacing(1),
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      },
    },
  })
);

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
    <div className={classes.root}>
      <Typography variant="h4" className={classes.mainTitle}>
        Best Sellers
      </Typography>
      <div className={classes.cardContainer}>
        <Grid container spacing={3}>
          {cards.slice(currentIndex, currentIndex + 4).map((card, index) => (
            <Grid key={index} item xs={12} sm={3}>
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
  );
};

export default BestSellersRenderer;
