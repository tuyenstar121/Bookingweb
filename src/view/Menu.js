import React, { useState, useEffect } from "react";
import axios from 'axios';
import MenuItems from "../components/Menu/Menuitems";
import Categories from "../components/Categories";
import Header from '../components/Header';
import Footer from '../components/Footer';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState(["all"]);
  const [activeCategory, setActiveCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
       
        console.log(categories);
        setIsLoading(false);
      } catch (error) {
        console.error("There was an error fetching the menu items!", error);
        setError("Failed to fetch menu items.");
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const filterItems = (category) => {
    setActiveCategory(category);
    if (category === "all") {
      setMenuItems(allItems);
    } else {
      const newItems = allItems.filter(item => item.category.name === category);
      setMenuItems(newItems);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Header />
      <div className="reservation-form">
        <section className="menu section">
          {error && <p className="error-message">{error}</p>}
          <div className="underline"></div>
          <Categories
            categories={categories}
            activeCategory={activeCategory}
            filterItems={filterItems}
          />
          <MenuItems items={menuItems} />
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Menu;
