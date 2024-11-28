// OrderView.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function OrderView({ open, onClose, foodItems, calculateTotalPrice }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-xl font-semibold">Food Items</DialogTitle>
      <DialogContent>
        {foodItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Image</th>
                  <th className="px-4 py-2 border-b">Price</th>
                  <th className="px-4 py-2 border-b">Quantity</th>
                  <th className="px-4 py-2 border-b">Description</th>
                </tr>
              </thead>
              <tbody>
                {foodItems.map((food, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">{food.foodItem.name}</td>
                    <td className="px-4 py-2 border-b">
                      <img 
                        src={food.foodItem.img} 
                        alt={food.foodItem.name} 
                        className="w-24 h-24 object-cover rounded-md" 
                      />
                    </td>
                    <td className="px-4 py-2 border-b">{food.foodItem.price} VND</td>
                    <td className="px-4 py-2 border-b">{food.quantity}</td>
                    <td className="px-4 py-2 border-b">{food.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between p-4">
              <span className="font-semibold">Total Price:</span>
              <span className="font-semibold">{calculateTotalPrice()} VND</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No food items found for this reservation.</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderView;
