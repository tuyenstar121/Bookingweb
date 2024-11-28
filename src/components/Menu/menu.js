import React, { useState, useEffect } from "react";
import axios from 'axios';
import MenuItems from "../Menu/Menuitems";
import Categories from "../Categories";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState(["all"]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");  // New state for search term
  const [, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState(() => {
    // Lấy dữ liệu từ localStorage, nếu không có thì trả về một mảng rỗng
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/food/all');
        const items = response.data;

        setMenuItems(items);
        setAllItems(items);

        const categoryNames = items.map(item => item.category.name);
        const uniqueCategories = ["all", ...new Set(categoryNames)];

        setCategories(uniqueCategories);
        setIsLoading(false);
      } catch (error) {
        console.error("There was an error fetching the menu items!", error);
        setError("Failed to fetch menu items.");
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const filterItems = (category) => {
    setActiveCategory(category);
    if (category === "all") {
      setMenuItems(allItems);
    } else {
      const newItems = allItems.filter(item => item.category.name === category);
      setMenuItems(newItems);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filteredItems = allItems.filter(item =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setMenuItems(filteredItems);
  };

  const handleAddToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.foodItemId === item.foodItemId);

    if (existingItem) {
      const updatedCart = cart.map(cartItem =>
        cartItem.foodItemId === item.foodItemId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1, note: '' }]);
    }
  };

  const handleIncrementQuantity = (itemId) => {
    const updatedCart = cart.map(cartItem =>
      cartItem.foodItemId === itemId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
    );
    setCart(updatedCart);
  };

  const handleDecrementQuantity = (itemId) => {
    const updatedCart = cart.map(cartItem =>
      cartItem.foodItemId === itemId && cartItem.quantity > 1 ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
    );
    setCart(updatedCart);
  };

  const handleNoteChange = (itemId, note) => {
    const updatedCart = cart.map(cartItem =>
      cartItem.foodItemId === itemId ? { ...cartItem, note: note } : cartItem
    );
    setCart(updatedCart);
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <section className="menu section">
        {error && <p className="error-message">{error}</p>}
        <div className="underline"></div>

        <div className="mb-6 flex justify-end">
          <div className="relative w-1/4">
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchTerm}
              onChange={handleSearch}
              className="form-control w-full p-2 pl-4 pr-10 border border-gray-300 rounded-lg"
            />
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </span>
          </div>
        </div>

        <Categories
          categories={categories}
          activeCategory={activeCategory}
          filterItems={filterItems}
        />
        <MenuItems items={menuItems} onAddToCart={handleAddToCart} />
      </section>

      <button className="shopping-cart-button fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg" onClick={handleCartClick}>
        <FontAwesomeIcon icon={faShoppingCart} size="2x" />
        {cart.length > 0 && <span className="badge">{cart.length}</span>}
      </button>

      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full h-3/4 overflow-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={handleCartClick}
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Giỏ Hàng</h2>
            {cart.length > 0 ? (
              <div>
                <ul>
                  {cart.map((item, index) => (
                    <li key={index} className="flex flex-col mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img src={item.img} alt={item.name} className="w-16 h-16 mr-4"/>
                          <p className="font-semibold">{item.name}</p>
                        </div>
                        <p>{item.price} VND</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded-l"
                            onClick={() => handleDecrementQuantity(item.foodItemId)}
                          >
                            -
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded-r"
                            onClick={() => handleIncrementQuantity(item.foodItemId)}
                          >
                            +
                          </button>
                        </div>
                        <div>{item.price * item.quantity} VND</div>
                      </div>
                      <div className="mt-2">
                        <textarea
                          className="w-full border rounded px-2 py-1"
                          placeholder="Ghi chú"
                          value={item.note}
                          onChange={(e) => handleNoteChange(item.foodItemId, e.target.value)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-semibold">Tổng số tiền ({cart.length} sản phẩm):</span>
                  <span className="text-red-500 font-bold">{totalAmount} VND</span>
                </div>
                <button
                  className="mt-4 bg-red-500 text-white px-3 py-1 rounded"
                  onClick={handleClearCart}
                >
                  Xóa Giỏ Hàng
                </button>
              </div>
            ) : (
              <p>Giỏ hàng trống</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
