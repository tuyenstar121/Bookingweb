import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Modal, OverlayTrigger, Popover, Table } from "react-bootstrap";
import RestaurantSelector from "./RestaurantSelector"; // Import the RestaurantSelector component

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTable, setEditTable] = useState(null);
  const [newTable, setNewTable] = useState({
    tableNumber: "",
    capacity: "",
    status: "",
  });

  useEffect(() => {
    if (selectedRestaurant) {
      fetchTablesByRestaurant(selectedRestaurant);
    }
  }, [selectedRestaurant]);

  const fetchTablesByRestaurant = async (restaurantId) => {
    try {
      const response = await axios.get(`http://localhost:8080/tables/by-restaurant/${restaurantId}`);
      setTables(response.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
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
      const response = await axios.put(`http://localhost:8080/tables/${editTable.id}`, editTable);
      setTables(tables.map((table) => (table.id === editTable.id ? response.data : table)));
    } catch (error) {
      console.error("Error editing table:", error);
    }
    handleEditModalClose();
  };

  const handleAddTable = async () => {
    try {
      const response = await axios.post("http://localhost:8080/tables", {
        ...newTable,
        restaurantId: selectedRestaurant,
      });
      setTables([...tables, response.data]);
      setNewTable({
        tableNumber: "",
        capacity: "",
        status: "",
      });
    } catch (error) {
      console.error("Error adding table:", error);
    }
  };

  const handleDeleteTable = async (tableId) => {
    try {
      await axios.delete(`http://localhost:8080/tables/${tableId}`);
      setTables(tables.filter((table) => table.id !== tableId));
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  };

  return (
    <div className="container mt-4">
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
                        type="text"
                        value={newTable.status}
                        onChange={(e) => setNewTable({ ...newTable, status: e.target.value })}
                      />
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
          {tables.map((table,index) => (
            <tr key={table.id}>
              <td>{index+1}</td>
              <td>{table.tableNumber}</td>
              <td>{table.capacity}</td>
              <td>{table.status}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(table)} className="me-2">
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeleteTable(table.id)}>
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
                type="text"
                value={editTable ? editTable.status : ""}
                onChange={(e) => setEditTable({ ...editTable, status: e.target.value })}
              />
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
