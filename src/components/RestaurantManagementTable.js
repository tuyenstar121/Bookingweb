import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

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

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:8080/restaurants'); // Update with your API endpoint
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
      if (isEditing) {
        await axios.put(`http://localhost:8080/restaurants/${currentRestaurant.restaurantId}`, currentRestaurant);
      } else {
        await axios.post('http://localhost:8080/restaurants', currentRestaurant);
      }
      fetchRestaurants();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving restaurant:', error);
    }
  };

  const handleDelete = async (restaurantId) => {
    try {
      await axios.delete(`http://localhost:8080/restaurants/${restaurantId}`);
      fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Restaurant Management</h3>
      <Button variant="primary" onClick={() => handleShowModal()}>Add New Restaurant</Button>
      <Table striped bordered hover className="mt-4">
        <thead>
            <tr>
          <th>STT</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant,index) => (
            <tr key={restaurant.restaurantId}>
              <td> {index+1}</td>
              <td>{restaurant.name}</td>
              <td>{restaurant.address}</td>
              <td>{restaurant.phone}</td>
              <td>{restaurant.description}</td>
              <td><img src={restaurant.image} alt={restaurant.name} style={{ width: '100px' }} /></td>
              <td>
                <Button variant="warning" onClick={() => handleShowModal(restaurant)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(restaurant.restaurantId)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Restaurant' : 'Add New Restaurant'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formRestaurantName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={currentRestaurant.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formRestaurantAddress" className="mt-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                name="address"
                value={currentRestaurant.address}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formRestaurantPhone" className="mt-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                name="phone"
                value={currentRestaurant.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formRestaurantDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                name="description"
                value={currentRestaurant.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formRestaurantImage" className="mt-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                name="image"
                value={currentRestaurant.image}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{isEditing ? 'Save Changes' : 'Add Restaurant'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RestaurantManagement;
