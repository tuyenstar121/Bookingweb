import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import ReservationList from '../ReservationList/ReservationList';

const ReservationHistory = ({ userId }) => {
  const [key, setKey] = useState('pending');
  const [reservations, setReservations] = useState([]);

  const fetchReservationsData = async (userId, status) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reservations/by-user-and-status?userId=${userId}&status=${status}`);
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchAllReservationsData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reservations/by-user?userId=${userId}`);
      const data = await response.json();
      setReservations(data);
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
  );
};

export default ReservationHistory;
