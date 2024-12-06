import React, { useState, useEffect } from "react";
import axios from 'axios';
import MenuItems from "../components/Menu/Menuitems";
import Categories from "../components/Categories";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Cart from "./cart";
const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState(["all"]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [promotionToday, setPromotionToday] = useState([]);

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
      } catch (error) {
        console.error("There was an error fetching the menu items!", error);
        setError("Lỗi tải dữ liệu món ăn");
      }
    };
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
    fetchMenuItems();
    fetchPromotionToday();
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));

    }
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

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    let categoryItems = [];
    if (activeCategory == 'all') {
      categoryItems = allItems;
    } else categoryItems = allItems.filter(item => item.category.name === activeCategory)
    const filteredItems = categoryItems.filter(item =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setMenuItems(filteredItems);
  };

  return (
    <div>
      <Header />
      <section className="section">
        {error && <p className="error-message">{error}</p>}
        <div className="underline"></div>
        <div className="my-6 flex justify-end">
          <div className="relative w-1/3">
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
        <MenuItems items={menuItems} onAddToCart={handleAddToCart} promotionToday={promotionToday} />
      </section>

      <button className="shopping-cart-button fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg" onClick={handleCartClick}>
        <FontAwesomeIcon icon={faShoppingCart} size="2x" />
        {cart.length > 0 && <span className="badge">{cart.length}</span>}
      </button>
      {
        isCartOpen && <Cart cart={cart} setCart={setCart} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} promotionToday={promotionToday} />
      }

      <Footer />
    </div>
  );
};

export default Menu;