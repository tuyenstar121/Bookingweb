import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tabs, Tab, ListGroup, Container, Row, Col } from 'react-bootstrap';
import { FaUser, FaLock, FaHeart, FaCalendarAlt, FaLink, FaSignOutAlt } from 'react-icons/fa';
import './Myaccount.css';
import PasswordManagementForm from '../password/password';
import ReservationList from '../ReservationList/ReservationList';
import Cookies from 'js-cookie';

const AccountDashboard = () => {
  const [key, setKey] = useState('pending');
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [storedUserId, setStoredUserId] = useState(null);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/id/${userId}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchReservationsData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reservations/by-user?userId=${userId}`);
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations data:', error);
    }
  };

  const fetchReservationsData1 = async (userId, status) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reservations/by-user-and-status?userId=${userId}&status=${status}`);
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const userId = Cookies.get('userId');
    if (userId) {
      setStoredUserId(userId);
      fetchUserData(userId);
      fetchReservationsData1(userId,'Booked');
    }
  }, []);

  return (
    <Container className="container1">
      <Row>
        <Col md={3} className="border-end">
          <div className="text-center py-3">
            <div>
              <img className="image-placeholder" src={userData?.img} alt="Avatar" />
            </div>
            <p>ID PasGo: {userData?.userId}</p>
            <p>SDT: {userData?.phone}</p>
          </div>
          <ListGroup variant="flush">
            <ListGroup.Item onClick={() => setActiveComponent('accountInfo')}><FaUser /> Thông tin tài khoản</ListGroup.Item>
            <ListGroup.Item onClick={() => setActiveComponent('passwordManager')}><FaLock /> Quản lý mật khẩu</ListGroup.Item>
            <ListGroup.Item onClick={() => setActiveComponent('wishlist')}><FaHeart /> Danh sách yêu thích</ListGroup.Item>
            <ListGroup.Item onClick={() => setActiveComponent('orderHistory')}><FaCalendarAlt /> Lịch sử đơn Đặt chỗ</ListGroup.Item>
            <ListGroup.Item onClick={() => setActiveComponent('accountLinking')}><FaLink /> Liên kết tài khoản</ListGroup.Item>
            <ListGroup.Item onClick={() => setActiveComponent('logout')}><FaSignOutAlt /> Thoát</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={9}>
          {activeComponent === 'dashboard' && (
            <Tabs id="order-tabs" activeKey={key} onSelect={(k) => { 
              setKey(k); 
              if (k === 'pending') {
                fetchReservationsData1(storedUserId, 'Booked');
              } else if (k === 'confirmed') {
                fetchReservationsData1(storedUserId, 'Confirmed');
              } else if (k === 'completed') {
                fetchReservationsData1(storedUserId, 'Completed');
              } else if (k === 'cancelled') {
                fetchReservationsData1(storedUserId, 'Cancelled');
              } else if (k === 'all') {
                fetchReservationsData(storedUserId);
              }
            }} className="mb-3">
              <Tab eventKey="pending" title="Chờ xác nhận">
                <ReservationList reservations={reservations} />
              </Tab>
              <Tab eventKey="confirmed" title="Đã tiếp nhận">
                <ReservationList reservations={reservations} />
              </Tab>
              <Tab eventKey="completed" title="Hoàn thành">
                <ReservationList reservations={reservations} />
              </Tab>
              <Tab eventKey="cancelled" title="Đã hủy">
                <ReservationList reservations={reservations} />
              </Tab>
              <Tab eventKey="all" title="Tất cả">
                <ReservationList reservations={reservations} />
              </Tab>
            </Tabs>
          )}
          {activeComponent === 'passwordManager' && <PasswordManagementForm />}
        </Col>
      </Row>
    </Container>
  );
};

export default AccountDashboard;
