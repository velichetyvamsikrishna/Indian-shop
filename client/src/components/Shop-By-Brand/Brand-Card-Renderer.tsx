import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  cardStyles: {
    maxWidth: 180,
    maxHeight: 180,
    borderRadius: 13,
    height: 180,
    width: 180,
    backgroundColor: "#F2F2F2",
  },
  imageStyles: {
    height: 104,
    width: 104,
    marginTop: 10,
    marginLeft: "auto",
    marginRight: "auto",
  },
  categoryTitle: {
    fontFamily: "Proxima Nova",
    fontSize: 16,
    fontWeight: 700,
    textAlign: "left",
    paddingLeft: 40,
  },
  categoryTitleArea: {
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const BrandCardRenderer = () => {
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
    </Card>
  );
};

export default BrandCardRenderer;
