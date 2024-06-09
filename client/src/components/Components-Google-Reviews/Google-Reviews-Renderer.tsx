const mockReviews = [
  {
    author_name: 'RAGHAVENDRA KUMAR',
    profile_photo_url: 'https://via.placeholder.com/150',
    text: 'I frequently visit this Indian shop for my requirements pertaining to Indian goods and consistently find the experience to be highly satisfactory. The shopkeepers are notably welcoming and efficient in their service. For those in search of authentic Indian products, this venue comes highly recommended. Their inventory is comprehensive, and should you find an item missing, the staff are diligent in ensuring its availability on subsequent visits. I wholeheartedly endorse this shop not only for its extensive selection but also for the exceptional deals it offers to all customers.',
    rating: 5,
  },
  {
    author_name: 'andrea tortorella',
    profile_photo_url: 'https://via.placeholder.com/150',
    text: ' The best in Milan. Seeing is believing. Great friendliness and excellent service. Ali Number One ',
    rating: 5,
  },
  {
    author_name: 'Giada Peveri',
    profile_photo_url: 'https://via.placeholder.com/150',
    text: 'I found king fisher and I am the happiest person in the world because of it! They have everything I ate/used in India, it is really well stocked! Well done!',
    rating: 5,
  },
  {
    author_name: 'RAGHAVENDRA KUMAR',
    profile_photo_url: 'https://via.placeholder.com/150',
    text: 'I frequently visit this Indian shop for my requirements pertaining to Indian goods and consistently find the experience to be highly satisfactory. The shopkeepers are notably welcoming and efficient in their service. For those in search of authentic Indian products, this venue comes highly recommended. Their inventory is comprehensive, and should you find an item missing, the staff are diligent in ensuring its availability on subsequent visits. I wholeheartedly endorse this shop not only for its extensive selection but also for the exceptional deals it offers to all customers.',
    rating: 5,
  },
  {
    author_name: 'andrea tortorella',
    profile_photo_url: 'https://via.placeholder.com/150',
    text: ' The best in Milan. Seeing is believing. Great friendliness and excellent service. Ali Number One ',
    rating: 5,
  },
  {
    author_name: 'Giada Peveri',
    profile_photo_url: 'https://via.placeholder.com/150',
    text: 'I found king fisher and I am the happiest person in the world because of it! They have everything I ate/used in India, it is really well stocked! Well done!',
    rating: 5,
  },

];

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, Avatar, Typography, IconButton, Grid, Box, Container } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import axios from 'axios';
import { useStyles } from "./Google-Reviews.styles";

const PLACE_ID = 'YOUR_PLACE_ID';
const API_KEY = 'YOUR_API_KEY';

interface Review {
  author_name: string;
  profile_photo_url: string;
  text: string;
  rating: number;
}

const GoogleReviewsRenderer: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const classes = useStyles();

  //relating display of reviews
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewsToShow, setReviewsToShow]=useState(4);
  const reviewDivRef = useRef<HTMLDivElement>(null);

  //end
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('https://serpapi.com/search', {
          params: {
            engine: 'google_maps_reviews',
            place_id: PLACE_ID,
            api_key: API_KEY,
          },
        });
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - reviewsToShow));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(mockReviews.length - reviewsToShow, prevIndex + reviewsToShow)
    );
  };

  return (
    <>
      <div style={{display: 'flex'}}>
        <IconButton
          className={`${classes.arrowButton} ${classes.leftArrow}`}
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeftIcon fontSize="large" />
        </IconButton>
        <Container maxWidth="lg">
          <div className={classes.root}>
            <Typography variant="h4" className={classes.mainTitle} gutterBottom>
              Customer Reviews
            </Typography>

            <Grid container spacing={8}>
              {reviews.slice(currentIndex, currentIndex + reviewsToShow).map((review, index) => (
                  <Grid
                    item
                    key={index}
                    xs={12}
                    sm={9}
                    md={6}
                    lg={3}
                    style={{ cursor: "pointer" }}
                  >
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                   <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar src={review.profile_photo_url} alt={review.author_name} />
                       <Box ml={2}>
                        <Typography variant="h6">{review.author_name}</Typography>
                      </Box>
                     </Box>
                     <Box 
                      height={100}
                      overflow={"auto"}
                      >
                      <Typography variant="body2" gutterBottom>
                        {review.text}
                      </Typography>
                    </Box>
                    <Box mt="auto">
                      <Typography variant="body2">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          starIndex < review.rating
                            ? <span key={starIndex}>⭐</span>
                            : <span key={starIndex}>☆</span>
                        ))}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                  </Grid>
                ))}
            </Grid>
          </div>  
        </Container>
        <IconButton
          className={`${classes.arrowButton}`}
          onClick={handleNext}
          disabled={mockReviews.length - reviewsToShow <=0 || currentIndex === mockReviews.length - reviewsToShow}
        >
          <ChevronRightIcon fontSize="large" />
        </IconButton>
      </div>
    </>
  );
};

export default GoogleReviewsRenderer;
