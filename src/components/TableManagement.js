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
      console.error("Error fetching tables:", error);
      toast.error("Error fetching tables");
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
      toast.success("Table updated successfully");
    } catch (error) {
      console.error("Error editing table:", error);
      const errorMessage = error.response?.data?.message || "Error editing table";
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
      toast.success("Table added successfully");
    } catch (error) {
      console.error("Error adding table:", error);
      toast.error("Error adding table");
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
      toast.success("Table deleted successfully");
    } catch (error) {
      console.error("Error deleting table:", error);
      toast.error("Error deleting table");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="admin-top">
        <h3>Table Management</h3>
        <RestaurantSelector
          selectedRestaurant={selectedRestaurant}
          setSelectedRestaurant={setSelectedRestaurant}
        />
        <div className="mt-4">
          <h4>Add New Table</h4>
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={
              <Popover id="popover-add-table">
                <Popover.Header as="h3">Add New Table</Popover.Header>
                <Popover.Body>
                  <Form>
                    <Form.Group controlId="formTableNumber">
                      <Form.Label>Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={newTable.tableNumber}
                        onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group controlId="formTableCapacity">
                      <Form.Label>Capacity</Form.Label>
                      <Form.Control
                        type="text"
                        value={newTable.capacity}
                        onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group controlId="formTableStatus">
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        as="select"
                        value={newTable.status}
                        onChange={(e) => setNewTable({ ...newTable, status: e.target.value })}
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                      </Form.Control>
                    </Form.Group>
                    <Button variant="primary" onClick={handleAddTable}>
                      Add Table
                    </Button>
                  </Form>
                </Popover.Body>
              </Popover>
            }
          >
            <Button variant="primary">Add New Table</Button>
          </OverlayTrigger>
        </div>
      </div>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>STT</th>
            <th>Number</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Actions</th>
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
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeleteTable(table.tableId)}>
                  Delete
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