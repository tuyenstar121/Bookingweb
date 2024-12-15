import React, { useState, useEffect } from "react";
import axios from 'axios';
import MenuItems from "../Menu/Menuitems";
import Categories from "../Categories";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';
import Cart from './cart'
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState(["all"]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");  // New state for search term
  const [, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [promotionToday, setPromotionToday] = useState([]);
  const [cart, setCart] = useState(() => {
    // Lấy dữ liệu từ localStorage, nếu không có thì trả về một mảng rỗng
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const token = Cookies.get('token');

  let decodedToken = jwtDecode(token);

  const userRole = decodedToken.role;

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
  const fetchPromotionToday = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/promotions/by-date?date=' + new Date().toISOString().split('T')[0]);

      const items = response.data;

      setPromotionToday(items)
    } catch (error) {
      console.error("There was an error fetching the menu items!", error);
      setError("Lỗi tải dữ liệu khuyến mãi");
    }
  };
  useEffect(() => {
    fetchPromotionToday()
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
  const isStaff = userRole === 'Staff'

  return (
    <div>
      <section className={`${!isStaff ? 'menu section' : ''}`}>
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
        <MenuItems items={menuItems} onAddToCart={handleAddToCart} promotionToday={promotionToday} isStaff={isStaff} />
      </section>


      <button className="shopping-cart-button fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg" onClick={handleCartClick}>
        <FontAwesomeIcon icon={faShoppingCart} size="2x" />
        {cart.length > 0 && <span className="badge">{cart.length}</span>}
      </button>
      {
        isCartOpen && <Cart cart={cart} setCart={setCart} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} promotionToday={promotionToday} />
      }
    </div >
  );
};

export default Menu;
