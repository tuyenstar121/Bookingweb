import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Modal, OverlayTrigger, Popover, Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RestaurantSelector from "./RestaurantSelector"; // Import the RestaurantSelector component
import Cookies from 'js-cookie'; // Add this import at the top

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTable, setEditTable] = useState(null);
  const [newTable, setNewTable] = useState({
    id: "",
    tableNumber: "",
    capacity: "",
    status: "available",
  });

  useEffect(() => {
    if (selectedRestaurant) {
      fetchTablesByRestaurant(selectedRestaurant);
    }
  }, [selectedRestaurant]);

  const fetchTablesByRestaurant = async (restaurantId) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No JWT token found');
      }

      const response = await axios.get(`http://localhost:8080/tables/by-restaurant/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTables(response.data);
    } catch (error) {
      console.error("Đã có lỗi khi lấy thông tin bàn:", error);
      toast.error("Đã có lỗi khi lấy thông tin bàn");
    }
  };

  const handleEdit = (table) => {
    setEditTable(table);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditTable(null);
  };

  const handleEditSubmit = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No JWT token found');
      }

      const response = await axios.put(`http://localhost:8080/tables/${editTable.tableId}`, editTable, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update only the edited table in the state
      setTables(tables.map((table) => (table.id === editTable.id ? response.data : table)));
      toast.success("Cập nhật thành công !");
    } catch (error) {
      console.error("Đã có lỗi xảy ra:", error);
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra";
      toast.error(errorMessage);
    }

    handleEditModalClose();
  };


  const handleAddTable = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No JWT token found');
      }

      const response = await axios.post("http://localhost:8080/tables/add", {
        ...newTable,
        restaurantId: selectedRestaurant,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTables([...tables, response.data]);
      setNewTable({
        tableNumber: "",
        capacity: "",
        status: "available",
      });
      toast.success("Thêm bàn thành công!");
    } catch (error) {
      console.error("Đã có lỗi xảy ra:", error);
      toast.error("Đã có lỗi xảy ra");
    }
  };
  const handleDeleteTable = async (tableId) => {

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No JWT token found');
      }
      await axios.delete(`http://localhost:8080/tables/${tableId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTables(tables.filter((table) => table.id !== tableId));
      toast.success("Xóa bàn thành công");
    } catch (error) {
      console.error("Đã có lỗi xảy ra:", error);
      toast.error("Đã có lỗi xảy ra");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="admin-top">
        <h3>Quản lý bàn</h3>
        <RestaurantSelector
          selectedRestaurant={selectedRestaurant}
          setSelectedRestaurant={setSelectedRestaurant}
        />
        <div className="mt-4">
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={
              <Popover id="popover-add-table">
                <Popover.Header as="h3">Thêm bàn mới</Popover.Header>
                <Popover.Body>
                  <Form>
                    <Form.Group controlId="formTableNumber">
                      <Form.Label>Số</Form.Label>
                      <Form.Control
                        type="text"
                        value={newTable.tableNumber}
                        onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group controlId="formTableCapacity">
                      <Form.Label>Số chỗ</Form.Label>
                      <Form.Control
                        type="text"
                        value={newTable.capacity}
                        onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group controlId="formTableStatus">
                      <Form.Label>Trạng thái</Form.Label>
                      <Form.Control
                        as="select"
                        value={newTable.status}
                        onChange={(e) => setNewTable({ ...newTable, status: e.target.value })}
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                      </Form.Control>
                    </Form.Group>
                    <Button className="mt-2" variant="primary" onClick={handleAddTable}>
                      Thêm bàn
                    </Button>
                  </Form>
                </Popover.Body>
              </Popover>
            }
          >
            <Button variant="primary">Thêm bàn mới</Button>
          </OverlayTrigger>
        </div>
      </div>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>STT</th>
            <th>Số</th>
            <th>Số chỗ</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table, index) => (
            <tr key={table.id}>
              <td>{index + 1}</td>
              <td>{table.tableNumber}</td>
              <td>{table.capacity}</td>
              <td>{table.status}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(table)} className="me-2">
                  Sửa
                </Button>
                <Button variant="danger" onClick={() => handleDeleteTable(table.tableId)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Table Modal */}
      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Table</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEditTableNumber">
              <Form.Label>Number</Form.Label>
              <Form.Control
                type="text"
                value={editTable ? editTable.tableNumber : ""}
                onChange={(e) => setEditTable({ ...editTable, tableNumber: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEditTableCapacity">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="text"
                value={editTable ? editTable.capacity : ""}
                onChange={(e) => setEditTable({ ...editTable, capacity: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEditTableStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={editTable ? editTable.status : "available"}
                onChange={(e) => setEditTable({ ...editTable, status: e.target.value })}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
