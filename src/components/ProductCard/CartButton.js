import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const CartButton = ({ cartItemCount, onClick }) => {
  return (
    <button className="shopping-cart-button" onClick={onClick}>
      <FontAwesomeIcon icon={faShoppingCart} size="2x" />
      <span className="badge">{cartItemCount}</span> {/* Dynamic count */}
    </button>
  );
};

export default CartButton; // Đảm bảo export default đúng cách
