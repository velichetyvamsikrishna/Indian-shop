import React, { useState, useEffect } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Typography,
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
    card: {
      minWidth: 275,
      textAlign: "center",
      height: "auto",
      minHeight: 200,
    },
    cardContent: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    arrowsContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: theme.spacing(2),
    },
    arrowButton: {
      margin: theme.spacing(0, 1),
    },
  })
);

const KitchenHomeSupplyRenderer: React.FC = () => {
  const classes = useStyles();
  const [currentIndex, setCurrentIndex] = useState(0);
  const cards = [1, 2, 3, 4, 5, 6];

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === cards.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.mainTitle}>
        Kitchen & Home Supply
      </Typography>
      <Grid container spacing={3}>
        {cards.length > 0 &&
          cards.slice(currentIndex, currentIndex + 4).map((review, index) => (
            <Grid key={index} item xs={12} sm={3}>
              <GroceryItemCardRenderer />
            </Grid>
          ))}
      </Grid>
      {cards.length > 4 && (
        <div className={classes.arrowsContainer}>
          <IconButton className={classes.arrowButton} onClick={handlePrevClick}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton className={classes.arrowButton} onClick={handleNextClick}>
            <ArrowForwardIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default KitchenHomeSupplyRenderer;
