import React from 'react';
import { FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import { useCart } from "../../context/CartContext";
import { useNavigate } from 'react-router-dom';
import NavBar from "../../layout/Navbar";
import Footer from "../../layout/Footer";

function ShoppingList() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const salesTaxRate = 0.05;

  const subtotal = totalPrice();
  const salesTax = subtotal * salesTaxRate;
  const grandTotal = subtotal + salesTax;

  return (
    <div className="min-h-screen bg-white text-[#115D5A] px-6 py-10">
      <NavBar />
      
      <h1 className="text-3xl font-bold text-center mb-10 mt-20">
        Your Cart ({Object.keys(cartItems).length} items)
      </h1>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-6 font-semibold border-b border-gray-300 pb-4 mb-4">
          <div className="col-span-3 ml-4 text-xl">Item</div>
          <div className="text-center text-xl">Price</div>
          <div className="text-center text-xl">Quantity</div>
          <div className="text-center text-xl">Total</div>
        </div>

        {Object.values(cartItems).map((item) => (
          <div key={item.id} className="grid grid-cols-6 items-center mb-6">
            <div className="col-span-3 flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
              <div>
                <h2 className="font-bold">{item.name}</h2>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-sm underline text-[#115D5A] hover:text-[#e7c873] mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="text-center mb-7 font-bold">${item.price.toFixed(2)}</div>
            <div className="text-center">
              <div className="inline-flex items-center border border-gray-300 rounded mb-6">
                <button 
                  onClick={() => decreaseQuantity(item.id)} 
                  className="px-2 text-xl hover:bg-gray-100"
                >
                  <FaMinus />
                </button>
                <span className="px-3">{item.quantity}</span>
                <button 
                  onClick={() => increaseQuantity(item.id)} 
                  className="px-2 text-xl hover:bg-gray-100"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            <div className="text-center">${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}

        <div className="mt-10 border-t border-gray-300 pt-4 max-w-md ml-auto text-right">
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Sales Tax:</span>
            <span>${salesTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Grand Total:</span>
            <span className="font-bold text-xl">${grandTotal.toFixed(2)}</span>
          </div>
          <button 
            className="bg-[#115D5A] text-white px-6 py-2 rounded shadow hover:bg-[#0d4745] transition w-full"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ShoppingList;