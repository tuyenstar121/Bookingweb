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

const AccountDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [storedUserId, setStoredUserId] = useState(null);
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/id/${userId}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const handleUpdateUserData = (updatedData) => {
    // Update user data logic here
    console.log('Updated User Data:', updatedData);
  };
  const handleLogin = () => {
    if (loggedIn) {
      // Perform logout logic
      setLoggedIn(false);
    } else {
      // Navigate to login page
      navigate("/login");
      Cookies.remove('userId');
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
