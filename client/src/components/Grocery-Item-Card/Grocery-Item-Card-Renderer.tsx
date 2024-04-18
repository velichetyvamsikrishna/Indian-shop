import * as React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  cardStyles: {
    maxWidth: 282,
    maxHeight: 374,
    borderRadius: 13,
    height: 374,
    width: 282,
    backgroundColor: "#909592",
  },
  imageStyles: {
    height: 220,
    width: 220,
    marginTop: 10,
    marginLeft: "auto",
    marginRight: "auto",
  },
  categoryTitle: {
    fontFamily: "Proxima Nova",
    fontSize: 16,
    fontWeight: 400,
    textAlign: "left",
    paddingLeft: 40,
    color: "#0D3823",
  },
  categoryTitleArea: {
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const GroceryItemCardRenderer = () => {
  return (
    <Card className={useStyles().cardStyles}>
      <CardMedia
        component="img"
        className={useStyles().imageStyles}
        image="https://i5.walmartimages.com/asr/90cdb9fd-c2d6-4f10-90c4-bbc16c6963a2.8590ae0e3e7ab073316455a9dd9cfd87.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF"
        alt="green iguana"
      />
      <CardContent className={useStyles().categoryTitleArea}>
        <Typography className={useStyles().categoryTitle}>Lizards</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default GroceryItemCardRenderer;
