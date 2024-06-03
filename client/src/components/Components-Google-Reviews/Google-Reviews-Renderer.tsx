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

];

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, Avatar, Typography, IconButton, Grid, Box } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import axios from 'axios';

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

  //relating display of reviews
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewsToShow, setReviewsToShow]=useState(4);
  const reviewDivRef = useRef<HTMLDivElement>(null);
  const [reviewWidth,setReviewWidth]=useState(250);

  const updateReviewsToShow = () => {
    if (reviewDivRef.current) {
      const availableWidth = reviewDivRef.current.offsetWidth;
      const newReviewsToShow = Math.floor(availableWidth / reviewWidth);
      setReviewsToShow(Math.max(newReviewsToShow, 1)); // Ensure at least 1 card is shown
    }
  };
  useEffect(() => {
    window.addEventListener("resize", updateReviewsToShow);
    updateReviewsToShow();
  }, []);


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
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - reviewsToShow));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + reviewsToShow >= reviews.length ? prevIndex : prevIndex + reviewsToShow));
  };

  return (
    <Box sx={{ textAlign: 'center', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Customer Reviews
      </Typography>
      {reviews.length === 0 ? (
        <Typography>No reviews available</Typography>
      ) : (
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton onClick={handlePrev} disabled={currentIndex === 0} sx={{ position: 'absolute', left: 0 }}>
            <ArrowBackIos />
          </IconButton>
          <Grid container spacing={2}
                justifyContent={reviews.length>(currentIndex + reviewsToShow) ? "space-around" : "flex-start"}
                sx={{ flexWrap: 'nowrap', overflowX: 'auto' }}
                ref={reviewDivRef} >
            {reviews.slice(currentIndex, currentIndex + reviewsToShow).map((review, index) => (
              // <Grid item key={index} sx={{ flex: '0 0 auto', width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)', lg: 'calc(25% - 16px)' }, background:"red" }}>
              <Grid item key={index} width={reviewWidth} sx={{ flex: '0 0 auto'}}>
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
          <IconButton onClick={handleNext} disabled={currentIndex + reviewsToShow >= reviews.length} sx={{ position: 'absolute', right: 0 }}>
            <ArrowForwardIos />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default GoogleReviewsRenderer;
