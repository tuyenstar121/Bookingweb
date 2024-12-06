import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const Cart = ({isCartOpen, setIsCartOpen, cart, setCart}) => {

    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    useEffect(() => {
    if (cart.length > 0){
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    }, [cart]);

    const handleClearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };
    const formatCurrency = (amount) => {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };
    const handleCartClick = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleDecrementQuantity = (itemId) => {
        const updatedCart = cart.map(cartItem =>
          cartItem.foodItemId === itemId && cartItem.quantity > 1 ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
        );
        setCart(updatedCart);
    };

    const handleIncrementQuantity = (itemId) => {
        const updatedCart = cart.map(cartItem =>
          cartItem.foodItemId === itemId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
        setCart(updatedCart);
    };

    const handleNoteChange = (itemId, note) => {
        const updatedCart = cart.map(cartItem =>
          cartItem.foodItemId === itemId ? { ...cartItem, note: note } : cartItem
        );
        setCart(updatedCart);
    };

    return ( 
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
                        <p>{formatCurrency(item.price)} </p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                            <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded-l"
                            onClick={() => handleDecrementQuantity(item.foodItemId)}
                            >
                            -
                            </button>
                            <span className="px-3">{formatCurrency(item.quantity)}</span>
                            <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded-r"
                            onClick={() => handleIncrementQuantity(item.foodItemId)}
                            >
                            +
                            </button>
                        </div>
                        <div>{formatCurrency(item.price * item.quantity)}</div>
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
                    <span className="text-red-500 font-bold">{formatCurrency(totalAmount)}</span>

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
     );
}
 
export default Cart;