import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Link,
  Popover,
  Popper,
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
import { Stack } from "react-bootstrap";

const Header = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(!!Cookies.get('token')); // Check if token exists to set initial loggedIn state

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
            Trang chủ
          </NavLink>
        </li>
        <li>
          <NavLink to={"/menu"}>Thực đơn</NavLink>
        </li>
        <li>
          <NavLink to={"/booking"}>Đặt bàn</NavLink>
        </li>
        <li>
          <NavLink to={"/mybooking"}>Tôi</NavLink>
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
                    Trang chủ
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/menu"}>Thực đơn</NavLink>
                </li>
                <li>
                  <NavLink to="/booking">Đặt bàn</NavLink>
                </li>s
              </ul>
            </Box>
            <Avatar
              alt="User Avatar"
              src="path_to_user_avatar_image"
              sx={{ ml: 2 }}
              onClick={handleClick}
            />
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Typography sx={{ p: 2 }} >
                <Link sx={{ textDecoration: 'none', color: 'black' }} href={'/mybooking'}>My Booking</Link>
              </Typography>
              <Divider />
              <Typography sx={{ p: 2, cursor: 'pointer' }} onClick={handleLogin}>{loggedIn ? 'Đăng xuất' : 'Đăng nhập'}</Typography>
            </Popover>
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
