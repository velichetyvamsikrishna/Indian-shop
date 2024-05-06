import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Divider, Button } from '@material-ui/core';
import { ShoppingCart, ArrowDropDown } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartDrawerRenderer from "../Components-Cart/Cart-Drawer-Renderer";
import { useGetAllCategoriesAPI, useCategoriesAPI } from "./../../api/productsAPI";
import { Link } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    background: 'white',
    paddingLeft: 100,
    paddingRight: 100,
    paddingTop: 10,
  },
  logo: {
    flexGrow: 1,
    fontFamily: 'Playfair Display',
    fontWeight: 900,
    fontSize: 22,
    color: '#0D3823',
    textTransform: 'capitalize',
    marginLeft: theme.spacing(2), // Add margin left for logo
  },
  menuContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  locationContainer: {
    display: 'flex',
    alignItems: 'center',
    width: 200,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    color: '#323232',
    fontFamily: 'Proxima Nova',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '24px',
    textTransform: 'capitalize'
  },
  searchContainer: {
    position: 'relative',
    backgroundColor: '#F2F2F2',
    borderRadius: 6,
    width: 432,
    marginRight: theme.spacing(2)
  },
  searchInput: {
    marginLeft: theme.spacing(2),
    flex: 1,
    color: '#909592',
    fontFamily: 'Proxima Nova',
    fontWeight: 400,
    fontSize: 14,
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
  cartIcon: {
    marginLeft: theme.spacing(2),
    color: '#0D3823'
  }
}));

const NavbarRenderer = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    fetchCategories();
  }, []);
  const handleCartClose = () => {
    setIsCartOpen(false);
  };
  const fetchCategories = async () => {
    const data = await useCategoriesAPI();
    
    setCategories(data);
  };
  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <div style={{ width: 151, height: 44, background: '#F2F2F2', alignContent: 'center', marginLeft: 14 }}>
            <Typography variant="h1" className={classes.logo}>
              Indian Shop
            </Typography>
          </div>
          <div className={classes.locationContainer}>
            <div className={classes.menuItem}>New York</div>
            <ArrowDropDown style={{ color: '#FF6600' }} />
          </div>
          <Divider
            orientation="vertical"
            style={{
              width: 0,
              height: 44,
              marginRight: 20,
              marginLeft: 20,
              transformOrigin: '0 0',
              border: '1px rgba(0, 0, 0, 0.27) solid'
            }}
          />
          <div className={classes.searchContainer}>
            <InputBase
              placeholder="Search everything at our store"
              className={classes.searchInput}
            />
            <div className={classes.searchIcon}>
              <SearchIcon style={{ width: 24.35, height: 24.35 }} />
            </div>
          </div>
          {/* <Button to="/login" style={{ marginLeft: "auto" }} className={classes.menuItem}>
            Login
          </Button>
          <Button to="/register" className={classes.menuItem}>
            Register
          </Button> */}
          <IconButton
            aria-label="cart"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
            color="inherit"
          >
            <ShoppingCartIcon style={{ color: '#0D3823' }} onClick={handleCartClick} />
            <CartDrawerRenderer isOpen={isCartOpen} onClose={handleCartClose} />
          </IconButton>
        </Toolbar>
        <Toolbar>
          <div className={classes.menuContainer}>
            {categories.map((x) => {
              return (
                <div className={classes.menuItem}>
                 <Link to={`/productList/category/${x.CAT_ID}`}> {x.CAT_NAME} </Link>
                  </div>
              );
            })}

            {/* <div className={classes.menuItem}>Rice Products</div>
            <div className={classes.menuItem}>Flour Products</div>
            <div className={classes.menuItem}>Pulses and Spices</div>
            <div className={classes.menuItem}>Beverages</div>
            <div className={classes.menuItem}>Oil and Ghee</div>
            <div className={classes.menuItem}>Household</div>
            <div className={classes.menuItem}>Deal of the Day</div>
            <div className={classes.menuItem}>Discounts</div> */}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavbarRenderer;
