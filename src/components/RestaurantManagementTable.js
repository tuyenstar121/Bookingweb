import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie'; // Add this import at the top

const initialRestaurant = {
  restaurantId: '',
  name: '',
  address: '',
  phone: '',
  description: '',
  image: ''
};

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState(initialRestaurant);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const token = Cookies.get('token'); // Get the JWT token from the cookie
      if (!token) {
        throw new Error('No JWT token found');
      }

      const response = await axios.get('http://localhost:8080/restaurants', {
        headers: {
          Authorization: `Bearer ${token}` // Add the Authorization header with the JWT token
        }
      });
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleShowModal = (restaurant = initialRestaurant) => {
    setCurrentRestaurant(restaurant);
    setIsEditing(!!restaurant.restaurantId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentRestaurant(initialRestaurant);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentRestaurant({ ...currentRestaurant, [name]: value });
  };



  const handleSubmit = async () => {
    try {
      const token = Cookies.get('token'); // Get the JWT token from the cookie
      if (!token) {
        throw new Error('No JWT token found');
      }

      if (isEditing) {
        await axios.put(`http://localhost:8080/restaurants/${currentRestaurant.restaurantId}`, currentRestaurant, {
          headers: {
            Authorization: `Bearer ${token}` // Add the Authorization header with the JWT token
          }
        });
      } else {
        await axios.post('http://localhost:8080/restaurants', currentRestaurant, {
          headers: {
            Authorization: `Bearer ${token}` // Add the Authorization header with the JWT token
          }
        });
      }
      fetchRestaurants();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving restaurant:', error);
    }
  };

  const handleDelete = async (restaurantId) => {
    try {
      const token = Cookies.get('token'); // Get the JWT token from the cookie
      if (!token) {
        throw new Error('No JWT token found');
      }

      await axios.delete(`http://localhost:8080/restaurants/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Add the Authorization header with the JWT token
        }
      });
      fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Quản lý nhà hàng</h3>
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          onChange={(e) => { setSearch(e.target.value) }}
          className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-gray-500"
        />
      </div>
      <Button variant="primary" onClick={() => handleShowModal()}>Thêm nhà hàng</Button>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Địa chỉ</th>
            <th>SĐT</th>
            <th>Mô tả</th>
            <th>Ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.filter((restaurant) => {
            return restaurant.name.toLowerCase().includes(search.toLowerCase())
              || restaurant.address.toLowerCase().includes(search.toLowerCase())
              || restaurant.phone.toLowerCase().includes(search.toLowerCase())
          }).map((restaurant, index) => (
            <tr key={restaurant.restaurantId}>
              <td> {index + 1}</td>
              <td>{restaurant.name}</td>
              <td>{restaurant.address}</td>
              <td>{restaurant.phone}</td>
              <td>{restaurant.description}</td>
              <td><img src={restaurant.image} alt={restaurant.name} style={{ width: '100px', height: 'auto', objectFit: 'cover' }} /></td>
              <td>
                <Button variant="warning" onClick={() => handleShowModal(restaurant)}>Sửa</Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(restaurant.restaurantId)}>Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Sửa nhà hàng' : 'Thêm mới nhà hàng'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formRestaurantName">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên"
                name="name"
                value={currentRestaurant.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formRestaurantAddress" className="mt-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập địa chỉ"
                name="address"
                value={currentRestaurant.address}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formRestaurantPhone" className="mt-3">
              <Form.Label>SĐT</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số điện thoại"
                name="phone"
                value={currentRestaurant.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formRestaurantDescription" className="mt-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập mô tả"
                name="description"
                value={currentRestaurant.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formRestaurantImage" className="mt-3">
              <Form.Label>URL hình ảnh</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập URL"
                name="image"
                value={currentRestaurant.image}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Hủy bỏ</Button>
          <Button variant="primary" onClick={handleSubmit}>{isEditing ? 'Lưu thay đổi' : 'Thêm nhà hàng'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RestaurantManagement;
