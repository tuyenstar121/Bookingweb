import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ListGroup, Container, Row, Col } from 'react-bootstrap';
import { FaUser, FaLock, FaHeart, FaCalendarAlt, FaLink, FaSignOutAlt } from 'react-icons/fa';
import './Myaccount.css';
import { useNavigate } from 'react-router-dom';
import PasswordManagementForm from '../password/password';
import ReservationHistory from '../Userprofile/ReservationHistory';
import Cookies from 'js-cookie';
import UserInfoForm from '../Userprofile/UserProfileForm';
import axios from 'axios';
import { toast } from 'react-toastify';

const AccountDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('accountInfo');
  const [userData, setUserData] = useState(null);
  const [storedUserId, setStoredUserId] = useState(null);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const fetchUserData = async (userId) => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(`http://localhost:8080/api/users/id/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleUpdateUserData = async (updatedData) => {
    try {
      const userId = Cookies.get('userId');
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No JWT token found');
      }
      const response = await axios.put(`http://localhost:8080/api/users/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserData(response.data);
      toast.success("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Error updating user data");
    }
  };

  const handleLogin = () => {
    if (loggedIn) {
      setLoggedIn(false);
      Cookies.remove('userId');
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const userId = Cookies.get('userId');
    if (userId) {
      setStoredUserId(userId);
      fetchUserData(userId);
    }
  }, []);

  return (
    <Container className="container1">
      <Row>
        <Col md={3} className="border-end">
          <div className="text-center py-3">
            <div>
              <img className="image-placeholder" src={userData?.img || '/path/to/default-avatar.png'} alt="Avatar" />
            </div>
            <p>ID PasGo: {userData?.userId}</p>
            <p>SDT: {userData?.phone}</p>
          </div>
          <ListGroup variant="flush">
            <ListGroup.Item action onClick={() => setActiveComponent('accountInfo')}>
              <FaUser /> Thông tin tài khoản
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => setActiveComponent('passwordManager')}>
              <FaLock /> Quản lý mật khẩu
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => setActiveComponent('wishlist')}>
              <FaHeart /> Danh sách yêu thích
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => setActiveComponent('reservationHistory')}>
              <FaCalendarAlt /> Lịch sử đơn Đặt chỗ
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => setActiveComponent('accountLinking')}>
              <FaLink /> Liên kết tài khoản
            </ListGroup.Item>
            <ListGroup.Item action onClick={handleLogin}>
              <FaSignOutAlt /> Thoát
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={9}>
          {activeComponent === 'passwordManager' && <PasswordManagementForm />}
          {activeComponent === 'reservationHistory' && <ReservationHistory userId={storedUserId} />}
          {activeComponent === 'accountInfo' && <UserInfoForm userData={userData} onUpdate={handleUpdateUserData} />}
        </Col>
      </Row>
    </Container>
  );
};

export default AccountDashboard;
