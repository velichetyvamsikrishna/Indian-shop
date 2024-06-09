import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  mainTitle: {
    marginBottom: theme.spacing(8),
    paddingTop: theme.spacing(6)
  },
  cardContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  gridContainer: {
    padding: theme.spacing(6), // Add spacing between arrows and cards
    transition: "transform 0.3s ease-in-out", // Add transition for moving cards
  },
  arrowsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  arrowButton: {
    backgroundColor: "transparent",
    color: theme.palette.text.primary,
    height: 50,
    width: 50,
    paddingTop: 150,
    margin: 'auto',
    "&:disabled": {
      color: theme.palette.text.disabled,
    },
  },
  leftArrow: {
    marginRight: theme.spacing(4), // Add spacing at the end of the screen for left arrow
  },
//   rightArrow: {
//     marginLeft: theme.spacing(4), // Add spacing at the end of the screen for right arrow
//   },
}));
