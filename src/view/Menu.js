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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
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
    if (cart.length > 0){
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

  return (
    <div>
      <Header/>
      <section className="section">
        {error && <p className="error-message">{error}</p>}
        <div className="underline"></div>
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
      {
        isCartOpen && <Cart cart={cart} setCart={setCart} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}/>
      }
      
      <Footer />
    </div>
  );
};

export default Menu;
