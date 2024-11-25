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
import ForgotPasswordForm from './Forgetpass';
import ResetPasswordForm from './resetpass';
import { CartProvider } from '../components/ProductCard/CartProvider';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import ChatBox from '../components/chatbox';
import AdminPromotion from './AdminPromotion';
function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkLoggedInStatus();
  }, []);

  const checkLoggedInStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8080/auth/current-user', {
        withCredentials: true,
      });
      setLoggedIn(response.data !== null);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  return (
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/mybooking" element={<MyBooking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Booking" element={<Booking />} />
            <Route path="/login/admin/Dashboard" element={<ProtectedRoute component={Admin} requiredRole="Admin" />} />

            <Route path="/admin/customers" element={<ProtectedRoute component={Adminu} requiredRole="Admin" />} />
            <Route path="/admin/Products" element={<ProtectedRoute component={Adminre} requiredRole="Admin" />} />
            <Route path="/admin/order" element={<ProtectedRoute component={Adminorder} requiredRole="Admin" />} />
            <Route path="/admin/analytics" element={<ProtectedRoute component={Admintable} requiredRole="Admin" />} />
            <Route path="/admin/food" element={<ProtectedRoute component={AdminFood} requiredRole="Admin" />} />
            <Route path="/admin/promotion" element={<ProtectedRoute component={AdminPromotion} requiredRole="Admin" />} />
            <Route path="/forgetpass" element={<ForgotPasswordForm />} />
            <Route path="/resetpass" element={<ResetPasswordForm />} />
          </Routes>
          {/* <ChatBox /> */}
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
