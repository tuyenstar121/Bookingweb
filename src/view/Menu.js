import React, { useState, useEffect } from "react";

import MenuItems from "../components/Menu/menu";

import Header from '../components/Header';
import Footer from '../components/Footer';


const HMenu = () => {

  const [cart, ] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);



 

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };


  return (
    <div>
      <Header cartItemCount={cart.length} onCartClick={handleCartClick} />
     <MenuItems/>
      <Footer />
    </div>
  );
};

export default HMenu;
