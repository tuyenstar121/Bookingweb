import React, { useState } from 'react';
import { ListGroup, Button, Row, Col, Image, Modal } from 'react-bootstrap';
import { AiOutlineSearch } from 'react-icons/ai';
import { format } from 'date-fns';
import ReviewForm from '../ProductCard/ReviewForm';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
const ReservationList = ({ reservations }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'text-green-800';
      case 'Booked':
        return 'text-yellow-800';
      case 'Cancelled':
        return 'text-red-800';
      case 'Completed':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  const handleReviewButtonClick = (reservation) => {
    setSelectedReservation(reservation);
    setShowReviewForm(true);
  };

  const handleReviewSubmit = (review) => {
    const { rating, comment } = review;
  
    const reviewData = {
      reservationId: selectedReservation.reservationId,
      rating: rating,
      comment: comment,
      createdAt: new Date().toISOString(), // Add createdAt timestamp
      updatedAt: new Date().toISOString(), // Add updatedAt timestamp
    };
  
    const token = Cookies.get('token'); // Assuming you're storing the token in cookies
  
    axios.post('http://localhost:8080/api/reviews', reviewData, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    })
    .then(response => {
      console.log('Review submitted successfully:', response.data);
      setShowReviewForm(false);
      setRating(0);
      setComment('');
      toast.success('Đã gửi đánh giá thành công!');
    })
    .catch(error => {
      console.error('Error submitting review:', error);
      toast.error('Bạn đã gửi đánh giá trước đó.');
    });
  };
  

  return (
    <>
      <div className="flex justify-between mb-3">
        <input
          type="text"
          placeholder="Nhập tìm kiếm"
          className="form-control w-3/4 p-2 border border-gray-300 rounded-lg"
        />
        <Button variant="danger">
          <AiOutlineSearch /> 
          {/* Tìm kiếm */}
        </Button>
      </div>
      <ListGroup>
        {reservations.map((reservation) => (
          <ListGroup.Item key={reservation.reservationId} className="border border-gray-300 p-4 mb-4 rounded-lg">
            <Row>
              <Col md={2}>
                <Image src={reservation.table.restaurants.image} rounded fluid />
              </Col>
              <Col md={8}>
                <p className="text-lg font-semibold text-gray-800 mb-2">ID: {reservation.reservationId}</p>
                <h5 className="text-xl font-bold text-gray-900 mb-2">{reservation.table.restaurants.name}</h5>
                <p className="text-base text-gray-700 mb-2">Đặt chỗ</p>
                <p className="text-base text-gray-700">
                  Thời gian đến: {formatDate(reservation.reservationDate)} ({reservation.reservationTime})
                </p>
              </Col>
              <Col md={2} className="text-right">
                <p className="text-base text-gray-700 mb-2">{formatDate(reservation.reservationDate)}</p>
                <p className="text-base text-gray-700">{reservation.reservationTime}</p>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <p className={`text-sm rounded px-2 py-1 ${getStatusColor(reservation.status)}`}>
                  {reservation.status}
                </p>
              </Col>
              {reservation.status === 'Completed' && (
                <Col className="text-right">
                  <Button variant="success" onClick={() => handleReviewButtonClick(reservation)}>
                    Đánh giá
                  </Button>
                </Col>
              )}
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {selectedReservation && (
        <Modal show={showReviewForm} onHide={() => setShowReviewForm(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Đánh giá Đặt chỗ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ReviewForm onSubmit={handleReviewSubmit} />
          </Modal.Body>
        </Modal>
      )}

      <ToastContainer /> {/* ToastContainer for displaying notifications */}
    </>
  );
};

export default ReservationList;
