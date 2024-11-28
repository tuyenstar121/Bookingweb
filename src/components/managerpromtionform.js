import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import { uploadImage } from '../utils/uploadImage';

const initialPromotion = {
  name: '',
  code: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'active',
  image: '',
};

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(initialPromotion);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('No JWT token found');

      const response = await axios.get('http://localhost:8080/api/promotions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPromotions(response.data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const handleShowModal = (promotion = initialPromotion) => {
    setCurrentPromotion(promotion);
    setIsEditing(!!promotion.id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPromotion(initialPromotion);
    setIsEditing(false);
    setSelectedFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPromotion({ ...currentPromotion, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      setIsUploading(true);

      let imageUrl = currentPromotion.image;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile); // Upload ảnh và lấy URL
      }

      const token = Cookies.get('token');
      if (!token) throw new Error('No JWT token found');

      const payload = { ...currentPromotion, image: imageUrl };

      if (isEditing) {
        await axios.put(
          `http://localhost:8080/api/promotions/${currentPromotion.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post('http://localhost:8080/api/promotions', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      fetchPromotions();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving promotion:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('No JWT token found');

      await axios.delete(`http://localhost:8080/api/promotions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Promotion Management</h3>
      <Button variant="primary" onClick={() => handleShowModal()}>
        Add New Promotion
      </Button>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
              <th className="px-6 py-3 text-left">STT</th>
              <th className="px-6 py-3 text-left">Món ăn</th>
              <th className="px-6 py-3 text-left">Mã giảm</th>
              <th className="px-6 py-3 text-left">Mô tả</th>
              <th className="px-6 py-3 text-left">Phần trăm</th>
              <th className="px-6 py-3 text-left">Ngày bắt đầu</th>
              <th className="px-6 py-3 text-left">Ngày kết thúc</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Hành động</th>
            </tr>
        </thead>
        <tbody>
          {promotions.map((promotion, index) => (
            <tr key={promotion.id}>
              <td className="px-6 py-3" >{index + 1}</td>
              <td className="px-6 py-3">{promotion.name}</td>
              <td className="px-6 py-3">{promotion.code}</td>
              <td className="px-6 py-3">{promotion.description}</td>
              <td className="px-6 py-3"> {promotion.startDate}</td>
              <td className="px-6 py-3">{promotion.endDate}</td>
              <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      promotion.status === "1"
                        ? "bg-green-200 text-green-700"
                        : "bg-red-200 text-red-700"
                    }`}
                  >
                    {promotion.isActive}
                  </span>
                </td>
              <td>
                {promotion.image && (
                  <img
                    src={promotion.image}
                    alt={promotion.name}
                    style={{
                      width: '100px',
                      height: 'auto',
                      objectFit: 'cover',
                    }}
                  />
                )}
              </td>
               <td className="px-6 py-3 flex space-x-2">
                  <button
                    onClick={() => handleShowModal(promotion)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(promotion.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Edit Promotion' : 'Add New Promotion'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPromotionName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={currentPromotion.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPromotionCode" className="mt-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter code"
                name="code"
                value={currentPromotion.code}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPromotionDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                name="description"
                value={currentPromotion.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPromotionStartDate" className="mt-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={currentPromotion.startDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPromotionEndDate" className="mt-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={currentPromotion.endDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPromotionStatus" className="mt-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={currentPromotion.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formPromotionImage" className="mt-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
              {currentPromotion.image && (
                <img
                  src={currentPromotion.image}
                  alt="Preview"
                  className="mt-3"
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PromotionManagement;
