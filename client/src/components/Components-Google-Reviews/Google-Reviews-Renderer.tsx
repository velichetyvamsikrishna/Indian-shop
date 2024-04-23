import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Container
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useStyles } from "./Google-Reviews.styles";

interface Review {
  author_name: string;
  rating: number;
  text: string;
}

const reviews: Review[] = [
  {
    author_name: "John Doe",
    rating: 5,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    time: "2022-01-01T12:00:00Z",
  },
  {
    author_name: "Jane Smith",
    rating: 4,
    text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    time: "2022-01-02T13:00:00Z",
  },
  {
    author_name: "Alice Johnson",
    rating: 5,
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    time: "2022-01-03T14:00:00Z",
  },
  {
    author_name: "Bob Williams",
    rating: 3,
    text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    time: "2022-01-04T15:00:00Z",
  },
  {
    author_name: "Eve Brown",
    rating: 5,
    text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    time: "2022-01-05T16:00:00Z",
  },
];

const GoogleReviewsRenderer: React.FC = () => {
  const classes = useStyles();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Container maxWidth="false" className={classes.container}>
      <div className={classes.root}>
        <Typography variant="h4" className={classes.mainTitle} gutterBottom>
          Customer Views
        </Typography>
        <Grid container spacing={3}>
          {reviews.length > 0 &&
            reviews.slice(currentIndex, currentIndex + 4).map((review, index) => (
              <Grid key={index} item xs={12} sm={9} md={6} lg={3}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Typography variant="h6" component="h2">
                      {review.author_name}
                    </Typography>
                    <Typography variant="body1" component="p">
                      {review.text}
                    </Typography>
                    <Typography color="textSecondary">{`Rating: ${review.rating}/5`}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
        {reviews.length > 4 && (
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
    </Container>
  );
};

export default GoogleReviewsRenderer;
