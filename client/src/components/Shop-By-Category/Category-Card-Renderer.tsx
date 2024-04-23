import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { categoryCard } from "./Shop-By-Category.styles";

const CategoryCardRenderer = () => {
  const classes = categoryCard();
  return (
    <Card className={classes.cardStyles}>
      <CardMedia
        component="img"
        className={classes.imageStyles}
        image="https://i5.walmartimages.com/asr/90cdb9fd-c2d6-4f10-90c4-bbc16c6963a2.8590ae0e3e7ab073316455a9dd9cfd87.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF"
        alt="green iguana"
      />
      <CardContent className={classes.categoryTitleArea}>
        <Typography className={classes.categoryTitle}>Lizards</Typography>
      </CardContent>
    </Card>
  );
};

export default CategoryCardRenderer;
