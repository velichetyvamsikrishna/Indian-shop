import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Button, Typography, Box, Paper } from "@material-ui/core";

const BannerRenderer: React.FC = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.banner} elevation={0}>
      <Box className={classes.content}>
        <Typography variant="h3" className={classes.title}>
          Fresh Vegetables and Fruits
        </Typography>
        <Button variant="contained" color="primary" className={classes.button}>
          Shop Now
        </Button>
        <div className={classes.discountCircle}>
          <Typography variant="body1" className={classes.discountText}>
            50% Off
          </Typography>
        </div>
      </Box>
      <div className={classes.decorativeElement}></div>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    banner: {
      backgroundColor: "#2E7D32", // Dark green shade
      width: "100%",
      height: "300px", // Adjust height as needed
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      position: "relative",
    },
    content: {
      textAlign: "left",
      zIndex: 1,
      marginLeft: theme.spacing(4), // Adjust margin as needed
    },
    title: {
      color: "#FFFFFF",
      marginBottom: theme.spacing(2),
    },
    button: {
      marginBottom: theme.spacing(2),
    },
    discountCircle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: "50%",
      width: "80px",
      height: "80px",
      position: "absolute",
      top: theme.spacing(2),
      right: theme.spacing(2),
    },
    discountText: {
      fontWeight: "bold",
      fontSize: "14px",
      color: "#F9A825",
    },
    decorativeElement: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      width: "50%",
      backgroundColor: "#8CD790", // Adjust color as needed
      zIndex: 0,
      clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0% 80%)", // Adjust clip path as needed
    },
  })
);

export default BannerRenderer;
