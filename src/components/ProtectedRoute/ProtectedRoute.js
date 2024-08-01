import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
const ProtectedRoute = ({ component: Component, requiredRole, ...rest }) => {
  const token = Cookies.get('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  let decodedToken;
  try {
    decodedToken = jwtDecode(token);
  } catch (error) {
    console.error('Token decoding error:', error);
    return <Navigate to="/login" />;
  }

  const userRole = decodedToken.role;

  if (requiredRole && userRole !== requiredRole) {

    toast.error('Bạn không có quyền truy cập vào trang này');
    return <Navigate to="/" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
