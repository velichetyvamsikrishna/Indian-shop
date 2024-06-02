import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, Typography, Link, Box } from '@material-ui/core';
import { Facebook, X, Instagram, LinkedIn, YouTube } from '@mui/icons-material';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footer: {
      position: 'relative',
      background: '#F5FBF5',
      height: '100%'
    },
  })
);

const FooterRenderer: React.FC = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Grid container  spacing={10} justifyContent="flex-start" alignItems="flex-start" style={{ paddingLeft: 100, paddingRight: 100, paddingTop: 30, paddingBottom: 30 }}>
        <Grid item xs={12} sm={9} md={6} lg={3}>
          <div  style={{ paddingBottom: 50 }}>
            <div style={{ width: 260, paddingBottom: 20 }}>
              <Typography variant="h5" style={{ color: '#0D3823', fontSize: 24, fontFamily: 'Playfair Display', fontWeight: 900, textTransform: 'capitalize', wordWrap: 'break-word' }}>
                Indian Shop<br />
              </Typography>
              <Typography variant="h5" style={{ color: '#FF6600', fontSize: 24, fontFamily: 'Proxima Nova', fontWeight: 400, textTransform: 'capitalize', wordWrap: 'break-word' }}>
                Milano
              </Typography>
            </div>
            <Typography>Involved in the import and distribution of asian/indian food and grocery items of all types in milan, italia ,first indian groceries shop in milan</Typography>
          </div>
          <Box
            style={{ width: 255, border: "1px solid #1A3F2D" }}
          />
        </Grid>

        {/* <Grid item xs={12} sm={9} md={6} lg={3}>
          <Typography style={{ fontSize: 16, fontFamily: 'Proxima Nova', paddingBottom: 20, fontWeight: 900, }}>All Categories</Typography>
          <Typography>Row 1</Typography>
          <Typography>Row 2</Typography>
          <Typography>Row 3</Typography>
          <Typography>Row 4</Typography>
          <Typography>Row 5</Typography>
        </Grid>

        <Grid item xs={12} sm={9} md={6} lg={3}>
          <Typography style={{ fontSize: 16, fontFamily: 'Proxima Nova', paddingBottom: 20, fontWeight: 900, }}>Company</Typography>
          <Typography>Row 1</Typography>
          <Typography>Row 2</Typography>
          <Typography>Row 3</Typography>
          <Typography>Row 4</Typography>
          <Typography>Row 5</Typography>
        </Grid>

        <Grid item xs={12} sm={9} md={6} lg={3}>

          <Typography style={{ fontSize: 16, fontFamily: 'Proxima Nova', paddingBottom: 20, fontWeight: 900, }}>Legal</Typography>
          <Typography>Row 1</Typography>
          <Typography>Row 2</Typography>
          <Typography>Row 3</Typography>
          <Typography>Row 4</Typography>
          <Typography>Row 5</Typography>

        </Grid> */}
      </Grid>
      {/* Social Media Links */}
      <Grid container spacing={10} justifyContent="flex-start" alignItems="flex-start" style={{ paddingLeft: 100, paddingRight: 100, paddingBottom: 50 }}>
        <Grid item xs={12} sm={9} md={6} lg={3}>
          <Typography  variant="body1" >
            Follow Us:
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <div style={{ width: 26, height: 26, }} >
                <X />
              </div>
            </Grid>
            <Grid item>
              <div style={{ width: 26, height: 26, }} >
                <Facebook />
              </div>
            </Grid>
            <Grid item>
              <div style={{ width: 26, height: 26, }} >
                <Instagram />
              </div>
            </Grid>
            <Grid item>
              <div style={{ width: 26, height: 26, }} >
                <YouTube />
              </div>
            </Grid>
            <Grid item>
              <div style={{ width: 26, height: 26, }} >
                <LinkedIn />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item  xs={12} sm={9} md={6} lg={3}>
          <Typography >
            Call Us:
          </Typography>
          <Typography variant="body1">+39 328 428 8799</Typography>
        </Grid>
        <Grid item  xs={12} sm={9} md={6} lg={3}>
          <Typography>
            Write Us:
          </Typography>
          <Typography variant="body1">mahomedali30@gmail.com</Typography>
        </Grid>
        <Grid item  xs={12} sm={9} md={6} lg={3}>
          <Typography variant="body1" >
            Address:
          </Typography>
          <Typography variant="body1">
            Via Panfilo Castaldi, 32, 20124 Milano MI, Italy
          </Typography>
        </Grid>
      </Grid>
      <Typography
        variant="body2"
        color="inherit"
        align="center"
        style={{ paddingTop: "16px", height: 38, background: '#438866', textAlign: 'center', color: 'white', fontSize: 14, fontFamily: 'Proxima Nova', fontWeight: '500', wordWrap: 'break-word' }}
      >
        &copy; {new Date().getFullYear()} Designed By InfyAir SRL. All rights
        reserved.
      </Typography>
    </footer>
  );
};

export default FooterRenderer;