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
import { useStyles } from "../Components-Kitchen-Home-Supply/Kitchen-Home-Supply.styles";
import BrandCardRenderer from "./Brand-Card-Renderer";
import {  useGetBrandsAPI } from "./../../api/productsAPI";

const ShopByBrandRenderer: React.FC = () => {
  const classes = useStyles();
  const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // Placeholder for card content
  
  const [brands, setBrands] = useState<any[]>([]);

  //relating display of brands
  const [currentIndex, setCurrentIndex] = useState(0);
  const [noOfBrandsToShow, setNoOfBrandsToShow]=useState(4);
  const divRef = useRef<HTMLDivElement>(null);
  const [brandWidth,setBrandWidth]=useState(200);

  const updateBrandsToShow = () => {
    if (divRef.current) {
      const availableWidth = divRef.current.offsetWidth - 100;
      const newBrandsToShow = Math.floor(availableWidth / brandWidth);
      console.log(newBrandsToShow);
      setNoOfBrandsToShow(Math.max(newBrandsToShow, 1)); // Ensure at least 1 card is shown
    }
  };
  useEffect(() => {
    window.addEventListener("resize", updateBrandsToShow);
    updateBrandsToShow();
  }, []);
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - noOfBrandsToShow));
  };
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + noOfBrandsToShow >= brands.length ? prevIndex : prevIndex + noOfBrandsToShow));
  };
  //end

  useEffect(() => {
    fetchBrands();
  }, []);
  const fetchBrands = async () => {
    const response = await useGetBrandsAPI();
    setBrands(response);
  };
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (cardRef.current) {
  //       const cardWidth = 180; // Width of each card
  //       const cardsWidth = cardRef.current.offsetWidth;
  //       const containerWidth = cardsWidth - 300 - numCardsToShow*30; // Subtracting 100px padding from both sides
  //       console.log("Container Width:", containerWidth);
  //       const newNumCardsToShow = Math.floor(containerWidth / cardWidth);
  //      // setNumCardsToShow(Math.max(newNumCardsToShow, 1)); // Ensure at least 1 card is shown
  //       setNumCardsToShow(4); // Ensure at least 1 card is shown

  //     }
  //   };
  
  //   window.addEventListener("resize", handleResize);
  //   handleResize(); // Call the function initially
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);
  

  // const handlePrev = () => {
  //   setCurrentIndex((prevIndex) => Math.max(0, prevIndex - numCardsToShow));
  // };

  // const handleNext = () => {
  //   setCurrentIndex((prevIndex) =>
  //     Math.min(cards.length - numCardsToShow, prevIndex + numCardsToShow)
  //   );
  // };

  return (
    <div style={{ padding: "100px" }}>
      {/* <Container> */}
        <div className={classes.root}>
          <Typography variant="h4" className={classes.mainTitle}>
            Shop By Brands
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
              spacing={2}
              className={classes.gridContainer}
              ref={divRef}
              justifyContent={brands.length>(currentIndex + noOfBrandsToShow) ? "space-around" : "flex-start"}
              // sx={{ flexWrap: 'nowrap', overflowX: 'auto' }}
            >
              {brands
                .slice(currentIndex, currentIndex + noOfBrandsToShow)
                .map((card, index) => (
                  <Grid key={index} item style={{width:`${brandWidth}`}}>
                    <BrandCardRenderer data={card} />
                  </Grid>
                ))}
            </Grid>
            <IconButton
              className={`${classes.arrowButton}`}
              onClick={handleNext}
              disabled={currentIndex >= brands.length - noOfBrandsToShow}
            >
              <ChevronRightIcon fontSize="large" />
            </IconButton>
          </div>
        </div>
      {/* </Container> */}
    </div>
  );
};

export default ShopByBrandRenderer;

// // Define styles for the component
// const useStyles2 = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       flexGrow: 1,
//       paddingTop: 50,
//       paddingBottom: 150,
//       paddingLeft: 40,
//       paddingRight: 40,
//     },
//     media: {
//       height: 300,
//       width: "auto",
//       margin: "auto",
//     },
//     cardContent: {
//       textAlign: "left",
//     },
//     addButton: {
//       marginTop: theme.spacing(2),
//     },
//     quantityControl: {
//       display: "flex",
//       alignItems: "center",
//     },
//     quantityInput: {
//       width: 50,
//       marginRight: theme.spacing(1),
//       marginLeft: theme.spacing(1),
//     },
//     mainTitle: {
//       textAlign: "center",
//       marginBottom: theme.spacing(4),
//     },
//   })
// );
