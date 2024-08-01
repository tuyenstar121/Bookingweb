import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import Logo from "../assets/images/logo.svg";

import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink, useNavigate } from "react-router-dom";
import "../style/HeaderStyles.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(!!Cookies.get('token')); // Check if token exists to set initial loggedIn state

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogin = async () => {
    try {
      if (loggedIn) {
        // Perform logout logic
        const response = await axios.post('http://localhost:8080/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        });
        
        if (response.status !== 200) {
          throw new Error('Logout failed');
        }

        // Xóa các cookie sau khi logout thành công
        Cookies.remove('userId');
        Cookies.remove('token');
        setLoggedIn(false); // Cập nhật trạng thái đăng nhập
        console.log('Logged out successfully');
      } else {
        // Navigate to login page
        navigate("/login");
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        color={"goldenrod"}
        variant="h6"
        component="div"
        sx={{ flexGrow: 1, my: 2 }}
      >
        <img src={Logo} alt="logo" height={"70"} width="200" />
      </Typography>
      <Divider />
      <ul className="mobile-navigation">
        <li>
          <NavLink activeClassName="active" to={"/"}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to={"/menu"}>Menu</NavLink>
        </li>
        <li>
          <NavLink to={"/booking"}>Booking</NavLink>
        </li>
        <li>
          <NavLink to={"/mybooking"}>Mybooking</NavLink>
        </li>
      </ul>
    </Box>
  );

  return (
    <>
      <Box>
        <AppBar component={"nav"} sx={{ bgcolor: "black" }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              sx={{
                mr: 2,
                display: { sm: "none" },
              }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              color={"goldenrod"}
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              <img src={Logo} alt="logo" height={"70"} width="250" />
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <ul className="navigation-menu">
                <li>
                  <NavLink activeClassName="active" to={"/"}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/menu"}>Menu</NavLink>
                </li>
                <li>
                  <NavLink to="/booking">Booking</NavLink>
                </li>
                <li>
                  <NavLink to={"/mybooking"}>Mybooking</NavLink>
                </li>
              </ul>
            </Box>
            <IconButton
              color="inherit"
              edge="end"
              sx={{ ml: 2 }}
              onClick={handleLogin}
            >
              {loggedIn ? <LogoutIcon /> : <LoginIcon />}
            </IconButton>
            <Avatar
              alt="User Avatar"
              src="path_to_user_avatar_image"
              sx={{ ml: 2 }}
            />
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: "240px",
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
        <Box>
          <Toolbar />
        </Box>
      </Box>
    </>
  );
};

export default Header;