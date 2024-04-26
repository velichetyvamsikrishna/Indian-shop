import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  Divider,
  Grid,
  FormControl,
  InputBase,
  Select,
  MenuItem,
} from "@material-ui/core";
import SortIcon from "@material-ui/icons/Sort";
import GroceryItemCardRenderer from "../Grocery-Item-Card/Grocery-Item-Card-Renderer";
import SearchIcon from "@mui/icons-material/Search";

const products = [
  // Sample product data
  { id: 1, name: "Product 1", price: 10.99, imageUrl: "product1.jpg" },
  { id: 2, name: "Product 2", price: 15.99, imageUrl: "product2.jpg" },
  { id: 3, name: "Product 3", price: 20.49, imageUrl: "product3.jpg" },
  { id: 4, name: "Product 4", price: 12.99, imageUrl: "product4.jpg" },
  { id: 5, name: "Product 5", price: 8.99, imageUrl: "product5.jpg" },
  { id: 6, name: "Product 6", price: 25.99, imageUrl: "product6.jpg" },
  { id: 7, name: "Product 7", price: 18.49, imageUrl: "product7.jpg" },
  { id: 8, name: "Product 8", price: 9.99, imageUrl: "product8.jpg" },
  { id: 9, name: "Product 9", price: 14.99, imageUrl: "product9.jpg" },
  { id: 10, name: "Product 10", price: 22.49, imageUrl: "product10.jpg" },
  { id: 11, name: "Product 11", price: 17.99, imageUrl: "product11.jpg" },
  { id: 12, name: "Product 12", price: 11.49, imageUrl: "product12.jpg" },
];

const ProductListingPageRenderer: React.FC = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <div className={classes.header}>
        <div className={classes.available} >
          <Typography className={classes.title}>
            Grocery Products
          </Typography>
          <Typography variant="body2">
            <span>246 available</span>
          </Typography>
        </div>
        <div className={classes.controls}>
          <div className={classes.searchContainer}>
            <InputBase
              placeholder="What are your looking for"
              className={classes.searchInput}
            />
            <div className={classes.searchIcon}>
              <SearchIcon style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <FormControl variant="outlined" >
            <Select
              labelId="sort-by-label"
              value=""
              displayEmpty
              className={classes.selectEmpty}
              inputProps={{ "aria-label": "Sort By" }}
            >
              <MenuItem value="" disabled>
                Sort By
              </MenuItem>
              <MenuItem value={1}>Price: Low to High</MenuItem>
              <MenuItem value={2}>Price: High to Low</MenuItem>
              <MenuItem value={3}>Best Seller</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <Divider className={classes.divider} />
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
            <GroceryItemCardRenderer />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(20)
    },
    header: {
      display: "flex",
      alignItems: "center",
      marginBottom: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      width: 737,
      color: '#0D3823',
      fontSize: 24,
      fontFamily: 'Proxima Nova',
      fontWeight: 800,
      wordWrap: 'break-word',
      marginBottom: theme.spacing(1)
    },
    controls: {
      display: "flex",
      alignItems: "center",
      marginLeft: "auto"
    },
    searchBox: {
      height: 35,
      marginRight: theme.spacing(1),
    },
    searchContainer: {
      position: 'relative',
      backgroundColor: '#FFF',
      borderRadius: 6,
      width: 252,
      height: 35,
      marginRight: theme.spacing(2),
      border: "1px solid grey"
    },
    searchInput: {
      marginLeft: theme.spacing(2),
      flex: 1,
      color: '#909592',
      fontFamily: 'Proxima Nova',
      fontWeight: 400,
      fontSize: 16,
      lineHeight: '24px',
      '&::placeholder': {
        color: '#909592'
      }
    },
    searchIcon: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#909592',
      width: 14.35,
      height: 14.35,
      right: 10,
      top: '50%',
      transform: 'translateY(-50%)'
    },
    selectEmpty: {
      height: 35, // Adjust the height as needed
      minWidth: 120, // Add any additional styling here
    },
    divider: {
      height: "2px",
      width: "100%",
      backgroundColor: theme.palette.primary.main,
      marginBottom: theme.spacing(2),
    },
    available: {
      display: 'block', // Ensure the text appears on a separate line
    },
  })
);

export default ProductListingPageRenderer;
