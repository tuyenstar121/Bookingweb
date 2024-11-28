import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import ReservationList from '../ReservationList/ReservationList';

const ReservationHistory = ({ userId }) => {
  const [key, setKey] = useState('Booked');
  const [reservations, setReservations] = useState([]);

  const fetchReservationsData = async (userId, status) => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(`http://localhost:8080/api/reservations/by-user-and-status`, {
        params: { userId, status },
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchAllReservationsData = async (userId) => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(`http://localhost:8080/api/reservations/by-user`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations data:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchReservationsData(userId, 'Booked');
    }
  }, [userId]);

  const handleSelect = (k) => {
    setKey(k);
    if (k === 'all') {
      fetchAllReservationsData(userId);
    } else {
      fetchReservationsData(userId, k.charAt(0).toUpperCase() + k.slice(1));
    }
  };

  return (
    <Tabs id="order-tabs" activeKey={key} onSelect={handleSelect} className="mb-3">
      <Tab eventKey="Booked" title="Chờ xác nhận">
        <ReservationList reservations={reservations} />
      </Tab>
      <Tab eventKey="Confirmed" title="Đã tiếp nhận">
        <ReservationList reservations={reservations} />
      </Tab>
      <Tab eventKey="Completed" title="Hoàn thành">
        <ReservationList reservations={reservations} />
      </Tab>
      <Tab eventKey="Cancelled" title="Đã hủy">
        <ReservationList reservations={reservations} />
      </Tab>
      <Tab eventKey="all" title="Tất cả">
        <ReservationList reservations={reservations} />
      </Tab>
    </Tabs>
  );
};

export default ReservationHistory;
