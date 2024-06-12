import React from "react";
import "./Menu.css";

const MenuItems = ({ items }) => {
  return (
  
    <div className="section-center">
      {items.map((item) => {
        const { id, name, img, description, price } = item;
        return (
          <article key={id} className="menu-item">
            <img src={img} alt={name} className="photo" />
            <div className="item-info">
              <header>
                <h4>{name}</h4>
                <h4 className="price">${price}</h4>
              </header>
              <p className="item-text">{description}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default MenuItems;
