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
import ForgotPasswordForm from'./Forgetpass' ;
import ResetPasswordForm from './resetpass'

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/mybooking" element={<MyBooking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Booking" element={<Booking />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/customers" element={<Adminu />} />
          <Route path="/Products" element={<Adminre />} />
          <Route path="/order" element={<Adminorder />} />
          <Route path="/analytics" element={<Admintable />} />
          <Route path="/food" element={<AdminFood />} />
          <Route path="/forgetpass" element={<ForgotPasswordForm />} />
          <Route path="/resetpass" element={<ResetPasswordForm />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
