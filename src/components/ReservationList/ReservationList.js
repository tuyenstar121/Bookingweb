import React from 'react';
import { Tabs, Tab, ListGroup, Button, Container, Row, Col, Image } from 'react-bootstrap';
import { AiOutlineSearch } from 'react-icons/ai';
import { format } from "date-fns";
const ReservationList = ({ reservations }) => {
    const formatDate = (date) => {
        return format(new Date(date), "dd/MM/yyyy");
      };
    
  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <input type="text" placeholder="Nhập tìm kiếm" className="form-control w-75" />
        <Button variant="danger"><AiOutlineSearch /> Tìm kiếm</Button>
      </div>
      <ListGroup>
        {reservations.map((reservation) => (
          <ListGroup.Item key={reservation.reservationId}>
            <Row>
              <Col md={2}>
                <Image src={reservation.table.restaurants.image} rounded fluid />
              </Col>
              <Col md={8}>
                <p>ID: {reservation.reservationId}</p>
                <h5>{reservation.table.restaurants.name}</h5>
                <p>Đặt chỗ</p>
                <p>Thời gian đến</p>
              </Col>
              <Col md={2}>
                <p>{formatDate(reservation.reservationDate)}</p>
                <p>{reservation.reservationTime}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="text-muted">{reservation.status}</p>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default ReservationList;
