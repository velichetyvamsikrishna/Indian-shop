import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { categoryCard } from "./Shop-By-Category.styles";

const CategoryCardRenderer = (data:any) => {
  const classes = categoryCard();
  return (
    <Card className={classes.cardStyles}>
      <CardMedia
        component="img"
        className={classes.imageStyles}
        image={data.data.PROD_IMG}
        alt="green iguana"
      />
      <CardContent className={classes.categoryTitleArea}>
        <Typography className={classes.categoryTitle}>{data.data.CAT_NAME}</Typography>
      </CardContent>
    </Card>
  );
};

export default CategoryCardRenderer;
