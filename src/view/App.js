// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Footer.css';
import '../style/global.css';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Admin from './admin';
import Menu from './Menu';
import Booking from './Booking';
import MyBooking from './Mybooking';
import Adminu from './adminuser';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from '../store/UserProvider';
import Adminre from './adminre';
import Adminorder from './adminorder';
import Admintable from './admintable';
import AdminFood from './aminFood';
import Adminpromotion from './adminPromo';
import Staffview from './staffviewbook';
import ForgotPasswordForm from './Forgetpass';
import ResetPasswordForm from './resetpass';
import { CartProvider } from '../components/ProductCard/CartProvider';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import ChatBox from '../components/chatbox';
import AdminPromotion from './AdminPromotion';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const setFavicon = (url) => {
    const link = document.querySelector("link[rel~='icon']");
    if (!link) {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      document.head.appendChild(newLink);
    }
    link.href = url;
  };

  return (
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/mybooking" element={<MyBooking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/Booking" element={<Booking />} />
              <Route path="/NV" element={<ProtectedRoute component={Staffview} requiredRole="Staff"/>}  />
              <Route path="/order" element={<ProtectedRoute component={Adminorder} requiredRole="Staff" />} />
              <Route path="/login/admin/Dashboard" element={<ProtectedRoute component={Admin} requiredRole="Admin" />} />

              <Route path="/admin/customers" element={<ProtectedRoute component={Adminu} requiredRole="Admin" />} />
              <Route path="/admin/Products" element={<ProtectedRoute component={Adminre} requiredRole="Admin" />} />
             
              <Route path="/admin/analytics" element={<ProtectedRoute component={Admintable} requiredRole="Admin" />} />
              <Route path="/admin/food" element={<ProtectedRoute component={AdminFood} requiredRole="Admin" />} />
              <Route path="/admin/promotion" element={<ProtectedRoute component={AdminPromotion} requiredRole="Admin" />} />
              <Route path="/forgetpass" element={<ForgotPasswordForm />} />
              <Route path="/resetpass" element={<ResetPasswordForm />} />
            </Routes>
          </LocalizationProvider>
          {/* <ChatBox /> */}
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
