import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Divider, Button } from '@material-ui/core';
import { ShoppingCart, ArrowDropDown } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartDrawerRenderer from "../Components-Cart/Cart-Drawer-Renderer";
import { useGetAllCategoriesAPI, useCategoriesAPI } from "./../../api/productsAPI";
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
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
    justifyContent:'flex-start',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    color: '#323232',
    fontFamily: 'Proxima Nova',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '24px',
    textTransform: 'capitalize'
  },
  categoryMenuItem: {
    display: 'flex',
    justifyContent:'flex-start',
    alignItems: 'center',
    // padding: theme.spacing(1, 2),
    color: '#323232',
    fontFamily: 'Proxima Nova',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '15px',
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
  const navigate=useNavigate();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  //category menu
  const [categoryMenuAnchor, setCategoryMenuAnchor]=useState<null | HTMLElement>(null);
  const menuCategoryOpen=Boolean(categoryMenuAnchor);
  const handleClickMenuCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCategoryMenuAnchor(event.currentTarget);
  };
  const handleCloseMenuCategory = () => {
    setCategoryMenuAnchor(null);
  };

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
  const handleCategoryClick=(categoryId:number)=>{
   navigate(`/productList/category/${categoryId}`);
  // alert(categoryId);
  }
  
  const handleClose = () => {
    setAnchorEl(null);
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
            <Button
              id="category_list"
              aria-controls={menuCategoryOpen ? 'category-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={menuCategoryOpen ? 'true' : undefined}
              onClick={handleClickMenuCategory}
            >
              Categories
                {
                  menuCategoryOpen ? <KeyboardArrowDownOutlinedIcon /> : <KeyboardArrowUpOutlinedIcon />
                }
            </Button>
            
            <Menu
              id="cateogry-menu"
              anchorEl={categoryMenuAnchor}
              open={menuCategoryOpen}
              onClose={handleCloseMenuCategory}
              MenuListProps={{
                'aria-labelledby': 'category_list',
              }}
              style={{height:"500px"}}
            >
              {
                categories.map((x) => {
                  return (
                    <div className={classes.menuItem}>
                      <MenuItem onClick={()=>handleCategoryClick(x.CAT_ID)}  className={classes.categoryMenuItem}>{x.CAT_NAME}</MenuItem>  
                    </div>
                  );
                })
              }
            </Menu>
            
          </div>
          <div className={classes.menuContainer}><Button>Best Sellers</Button></div> 
          <div className={classes.menuContainer}><Button>New Arrivals</Button></div> 
          <div className={classes.menuContainer}><Button>On Sale</Button></div> 
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavbarRenderer;
