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
    fetchTablesByRestaurant(1);
  });

  const fetchTablesByRestaurant = async (restaurantId) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Không tìm thấy token JWT');
      }

      const response = await axios.get(`http://localhost:8080/tables/by-restaurant/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTables(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bàn:", error);
      toast.error("Lỗi khi lấy danh sách bàn");
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
        throw new Error('Không tìm thấy token JWT');
      }

      const response = await axios.put(`http://localhost:8080/tables/${editTable.tableId}`, editTable, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status.data?.status === 200){
        setTables(tables.map((table) => (table.id === editTable.id ? response.data : table)));
        toast.success("Cập nhật bàn thành công");
      } else {
        toast.error(response.data.message);
      }
      console.log(response)
      // Cập nhật chỉ bàn đã chỉnh sửa trong trạng thái
      
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa bàn:", error);
      const errorMessage = error.response?.data?.message || "Lỗi khi chỉnh sửa bàn";
      toast.error(errorMessage);
    }

    handleEditModalClose();
  };


  const handleAddTable = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Không tìm thấy token JWT');
      }

      const response = await axios.post("http://localhost:8080/tables/add", {
        ...newTable,
        restaurantId: 1,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status.data?.status === 200){
        setTables([...tables, response.data]);
        setNewTable({
          tableNumber: "",
          capacity: "",
          status: "available",
        });
        toast.success("Thêm bàn mới thành công");
      } else {
        toast.error(response.data.message);
        
      }
      
    } catch (error) {
      console.error("Lỗi khi thêm bàn:", error);
      toast.error("Lỗi khi thêm bàn");
    }
  };
  const handleDeleteTable = async (tableId) => {

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Không tìm thấy token JWT');
      }
      await axios.delete(`http://localhost:8080/tables/${tableId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTables(tables.filter((table) => table.id !== tableId));
      toast.success("Xóa bàn thành công");
    } catch (error) {
      console.error("Lỗi khi xóa bàn:", error);
      toast.error("Lỗi khi xóa bàn");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="admin-top">
        <h3>Quản lý Bàn</h3>

        <div className="mt-4">
          <h4>Thêm Bàn Mới</h4>
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={
              <Popover id="popover-add-table">
                <Popover.Header as="h3">Thêm Bàn Mới</Popover.Header>
                <Popover.Body>
                  <Form>
                    <Form.Group controlId="formTableNumber">
                      <Form.Label>Số Bàn</Form.Label>
                      <Form.Control
                        type="text"
                        value={newTable.tableNumber}
                        onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group controlId="formTableCapacity">
                      <Form.Label>Sức Chứa</Form.Label>
                      <Form.Control
                        type="number"
                        value={newTable.capacity}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value > 0 && !isNaN(value)) {
                            setNewTable({ ...newTable, capacity: value });
                          }
                        }}
                        min="1"
                        step="1"
                      />
                    </Form.Group>
                    <Form.Group controlId="formTableStatus">
                      <Form.Label>Trạng Thái</Form.Label>
                      <Form.Control
                        as="select"
                        value={newTable.status}
                        onChange={(e) => setNewTable({ ...newTable, status: e.target.value })}
                      >
                        <option value="available">Còn Trống</option>
                        <option value="occupied">Đã Đặt</option>
                      </Form.Control>
                    </Form.Group>
                    <Button variant="primary" onClick={handleAddTable}>
                      Thêm Bàn
                    </Button>
                  </Form>
                </Popover.Body>
              </Popover>
            }
          >
            <Button variant="primary">Thêm Bàn Mới</Button>
          </OverlayTrigger>
        </div>
      </div>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>STT</th>
            <th>Số Bàn</th>
            <th>Sức Chứa</th>
            <th>Trạng Thái</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table, index) => (
            <tr key={table.id}>
              <td>{index + 1}</td>
              <td>{table.tableNumber}</td>
              <td>{table.capacity}</td>
              <td>{table.status === 'available' ? 'Còn Trống' : 'Đã Đặt'}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(table)} className="me-2">
                  Chỉnh Sửa
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
          <Modal.Title>Chỉnh Sửa Bàn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEditTableNumber">
              <Form.Label>Số Bàn</Form.Label>
              <Form.Control
                type="text"
                value={editTable ? editTable.tableNumber : ""}
                onChange={(e) => setEditTable({ ...editTable, tableNumber: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEditTableCapacity">
              <Form.Label>Sức Chứa</Form.Label>
              <Form.Control
                type="text"
                value={editTable ? editTable.capacity : ""}
                onChange={(e) => setEditTable({ ...editTable, capacity: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEditTableStatus">
              <Form.Label>Trạng Thái</Form.Label>
              <Form.Control
                as="select"
                value={editTable ? editTable.status : "available"}
                onChange={(e) => setEditTable({ ...editTable, status: e.target.value })}
              >
                <option value="available">Còn Trống</option>
                <option value="occupied">Đã Đặt</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
