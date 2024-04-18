import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Grid, Typography, Link } from "@mui/material";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footer: {
      backgroundColor: "cyan",
      padding: theme.spacing(4),
      marginTop: "auto",
    },
    column: {
      display: "flex",
      flexDirection: "column",
    },
    socialMedia: {
      marginTop: theme.spacing(2),
    },
  })
);

const FooterRenderer: React.FC = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Grid container spacing={4}>
        {/* Column 1 */}
        <Grid item xs={12} sm={6} md={3}>
          <div className={classes.column}>
            <Typography variant="h6">Column 1</Typography>
            <Typography>Row 1</Typography>
            <Typography>Row 2</Typography>
            <Typography>Row 3</Typography>
            <Typography>Row 4</Typography>
            <Typography>Row 5</Typography>
          </div>
        </Grid>
        {/* Column 2 */}
        <Grid item xs={12} sm={6} md={3}>
          <div className={classes.column}>
            <Typography variant="h6">Column 2</Typography>
            <Typography>Row 1</Typography>
            <Typography>Row 2</Typography>
            <Typography>Row 3</Typography>
            <Typography>Row 4</Typography>
            <Typography>Row 5</Typography>
          </div>
        </Grid>
        {/* Column 3 */}
        <Grid item xs={12} sm={6} md={3}>
          <div className={classes.column}>
            <Typography variant="h6">Column 3</Typography>
            <Typography>Row 1</Typography>
            <Typography>Row 2</Typography>
            <Typography>Row 3</Typography>
            <Typography>Row 4</Typography>
            <Typography>Row 5</Typography>
          </div>
        </Grid>
        {/* Column 4 */}
        <Grid item xs={12} sm={6} md={3}>
          <div className={classes.column}>
            <Typography variant="h6">Column 4</Typography>
            <Typography>Row 1</Typography>
            <Typography>Row 2</Typography>
            <Typography>Row 3</Typography>
            <Typography>Row 4</Typography>
            <Typography>Row 5</Typography>
          </div>
        </Grid>
      </Grid>
      {/* Social Media Links */}
      <div className={classes.socialMedia}>
        <Typography variant="body2">Follow us:</Typography>
        <Link
          href="#"
          variant="body2"
          color="inherit"
          underline="hover"
          style={{ marginRight: "8px" }}
        >
          Facebook
        </Link>
        <Link
          href="#"
          variant="body2"
          color="inherit"
          underline="hover"
          style={{ marginRight: "8px" }}
        >
          Twitter
        </Link>
        <Link
          href="#"
          variant="body2"
          color="inherit"
          underline="hover"
          style={{ marginRight: "8px" }}
        >
          Instagram
        </Link>
      </div>
      {/* Copyright */}
      <Typography
        variant="body2"
        color="inherit"
        align="center"
        style={{ marginTop: "16px" }}
      >
        &copy; {new Date().getFullYear()} Your Company Name. All rights
        reserved.
      </Typography>
    </footer>
  );
};

export default FooterRenderer;
