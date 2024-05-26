import React, { useRef, useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid,
  Container
} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import GroceryItemCardRenderer from "../Grocery-Item-Card/Grocery-Item-Card-Renderer";
import { useStyles } from "./Best-Sellers.styles";
//api
import { useGetProductsByFilterAPI } from "../../api/productsAPI";


const BestSellersRenderer: React.FC = () => {
  const classes = useStyles();
  const [cards, setCards]=useState<any[]>([]);// products
  const cardRef = useRef<HTMLDivElement>(null);
  const [numCardsToShow, setNumCardsToShow] = useState(4); // Initial number of cards to show
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (cardRef.current) {
        const cardWidth = 275; // Width of each card
        const cardsWidth = cardRef.current.offsetWidth;
        const containerWidth = cardsWidth - 300; // Subtracting 100px padding from both sides
        console.log("Container Width:", containerWidth);
        const newNumCardsToShow = Math.floor(containerWidth / cardWidth);
        setNumCardsToShow(Math.max(newNumCardsToShow, 1)); // Ensure at least 1 card is shown
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Call the function initially
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    updateBestSellers();
  }, []);

  const updateBestSellers = () => {
    useGetProductsByFilterAPI({ filter: "Bestsellers" })
      .then((products) => {
        setCards(products);
      })
      .catch((error) => {
        console.log("Failed to fetch best sellers:", error);
        setCards([]); // Optionally set to an empty array or handle it as needed
      });
  };
  

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - numCardsToShow));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(cards.length - numCardsToShow, prevIndex + numCardsToShow)
    );
  };

  return (
    <div style={{ padding: "100px" }}>
      {/* <Container> */}
        <div className={classes.root}>
          <Typography variant="h4" className={classes.mainTitle}>
            Best Sellers
          </Typography>
          <div className={classes.cardContainer}>
            <IconButton
              className={`${classes.arrowButton} ${classes.leftArrow}`}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeftIcon fontSize="large" />
            </IconButton>
            <Grid
              container
              spacing={4}
              className={classes.gridContainer}
              ref={cardRef}
            >
              {cards
                .slice(currentIndex, currentIndex + numCardsToShow)
                .map((card, index) => (
                  <Grid key={index} item >
                    <GroceryItemCardRenderer product={card}/>
                  </Grid>
                ))}
            </Grid>
            <IconButton
              className={`${classes.arrowButton}`}
              onClick={handleNext}
              disabled={currentIndex === cards.length - numCardsToShow}
            >
              <ChevronRightIcon fontSize="large" />
            </IconButton>
          </div>
        </div>
      {/* </Container> */}
    </div>
  );
};

export default BestSellersRenderer;
