import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { FaSearch } from "react-icons/fa";

export default function FoodManagement() {
  const [foodItems, setFoodItems] = useState([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(""); // "edit", "delete", or "add"
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [newFoodItem, setNewFoodItem] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    img: "",
  });

  const fetchFoodItems = useCallback(async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch("http://localhost:8080/api/food/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setFoodItems(data);
      setFilteredFoodItems(data);
    } catch (error) {
      console.error("Error fetching food items:", error);
    }
  }, []);

  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = foodItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.name.toLowerCase().includes(query)
    );
    setFilteredFoodItems(filtered);
  };

  const handleDialogOpen = (type, foodItem = null) => {
    setDialogType(type);
    if (type === "edit" || type === "delete") {
      setSelectedFoodItem(foodItem);
    } else {
      setNewFoodItem({
        name: "",
        price: "",
        description: "",
        categoryId: "",
        img: "",
      });
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setDialogType("");
    setSelectedFoodItem(null);
    setOpenDialog(false);
  };

  const handleDelete = async (foodItemId) => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(`http://localhost:8080/api/food/${foodItemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setFoodItems((prev) => prev.filter((item) => item.foodItemId !== foodItemId));
        setFilteredFoodItems((prev) => prev.filter((item) => item.foodItemId !== foodItemId));
        handleDialogClose();
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };

  const handleSave = async () => {
    const token = Cookies.get("token");
    const url =
      dialogType === "edit"
        ? `http://localhost:8080/api/food/${selectedFoodItem.foodItemId}`
        : "http://localhost:8080/api/food";
    const method = dialogType === "edit" ? "PUT" : "POST";
    const body = JSON.stringify(dialogType === "edit" ? selectedFoodItem : newFoodItem);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (response.ok) {
        fetchFoodItems();
        handleDialogClose();
      } else {
        console.error("Failed to save item");
      }
    } catch (error) {
      console.error("Error saving food item:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4">Quản lý món ăn</h3>

      {/* Search Bar */}
      <div className="mb-4 relative flex justify-end">
        <input
          type="text"
          className="w-80 p-2 border border-gray-300 rounded-l focus:outline-none"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button className="bg-gray-100 p-2 border border-gray-300 rounded-r">
          <FaSearch className="text-gray-500" />
        </button>
      </div>

      {/* Food Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-200 rounded-lg bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Tên</th>
              <th className="px-4 py-2 text-left">Hình ảnh</th>
              <th className="px-4 py-2 text-left">Giá</th>
              <th className="px-4 py-2 text-left">Mô tả</th>
              <th className="px-4 py-2 text-left">Danh mục</th>
              <th className="px-4 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredFoodItems.map((foodItem) => (
              <tr key={foodItem.foodItemId} className="border-t">
                <td className="px-4 py-2">{foodItem.name}</td>
                <td className="px-4 py-2">
                  {foodItem.img ? (
                    <img
                      src={foodItem.img}
                      alt={foodItem.name}
                      className="w-20 h-auto object-contain"
                    />
                  ) : (
                    <span>Không có hình</span>
                  )}
                </td>
                <td className="px-4 py-2">{foodItem.price}</td>
                <td className="px-4 py-2">{foodItem.description}</td>
                <td className="px-4 py-2">{foodItem.category.name}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => handleDialogOpen("edit", foodItem)}
                  >
                    Sửa
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDialogOpen("delete", foodItem)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h3 className="text-xl font-bold mb-4">
              {dialogType === "edit" && "Chỉnh sửa món ăn"}
              {dialogType === "delete" && "Xóa món ăn"}
              {dialogType === "add" && "Thêm món ăn"}
            </h3>
            {dialogType === "delete" ? (
              <p>Bạn có chắc chắn muốn xóa món ăn này?</p>
            ) : (
              <>
                <input
                  type="text"
                  className="w-full p-2 mb-4 border rounded"
                  placeholder="Tên món ăn"
                  value={dialogType === "edit" ? selectedFoodItem?.name : newFoodItem.name}
                  onChange={(e) =>
                    dialogType === "edit"
                      ? setSelectedFoodItem((prev) => ({ ...prev, name: e.target.value }))
                      : setNewFoodItem((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                {/* Add other input fields similarly */}
              </>
            )}
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={handleDialogClose}
              >
                Hủy
              </button>
              {dialogType === "delete" ? (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleDelete(selectedFoodItem.foodItemId)}
                >
                  Xóa
                </button>
              ) : (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleSave}
                >
                  Lưu
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}