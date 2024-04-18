import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Button,
} from "@mui/material";
import Link, { LinkProps } from "@material-ui/core/Link";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationSearchRenderer from "./Location-Search-Renderer";
import CartDrawerRenderer from "../Components-Cart/Cart-Drawer-Renderer";
//import home, login from "../../main/index"

interface INavBarRenderer {
  currentUserLocation: string;
}

const NavBarRenderer: React.FC<INavBarRenderer> = ({ currentUserLocation }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
 const navigate = useNavigate();
  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
    
    <Link innerRef={ref as any} {...props} />
  ));
  return (
    <AppBar
      position="static"
      sx={{ background: "transparent", borderTop: "1px solid #00000045" }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: "black" }}
        >
          Indian Shop Milano
        </Typography>
        <LocationSearchRenderer />
        <div style={{ flexGrow: 1 }}>
          <IconButton size="large">
            <SearchIcon />
          </IconButton>
          <InputBase
            placeholder="Search..."
            inputProps={{ "aria-label": "search" }}
            sx={{ color: "inherit" }}
          />
        </div>
        <Button href="/login"  sx={{ textTransform: "none", marginRight: 1 }} >
          Login
        </Button>
        <Button href="/signup" sx={{ textTransform: "none", marginRight: 1 }}>
          Register
        </Button>
        <IconButton
          aria-label="cart"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          color="inherit"
        >
          <ShoppingCartIcon sx={{ color: "black" }} onClick={handleCartClick} />
          <CartDrawerRenderer isOpen={isCartOpen} onClose={handleCartClose} />
        </IconButton>
      </Toolbar>
      <Toolbar>
        {/* Actionable nav items */}
        <Button href="/login"  sx={{ textTransform: "none", marginRight: 1 }}>
          Rice Products
        </Button>
        <Button href="/signup" sx={{ textTransform: "none", marginRight: 1 }}>
         Flour Products
        </Button>
        <Button href="/" component={AdapterLink} sx={{ textTransform: "none", marginRight: 1 }}>
          Pulses and Spices
        </Button>
        <Button href="/" component={AdapterLink} sx={{ textTransform: "none", marginRight: 1 }}>
          Bevarages
        </Button>
        <Button href="/" component={AdapterLink} sx={{ textTransform: "none" }}>
          Oil and Ghee
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBarRenderer;
