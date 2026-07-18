import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  const updateCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleQuantityChange = (index, delta) => {
    const updated = [...cart];
    updated[index].quantity = Math.max(1, updated[index].quantity + delta);
    updateCart(updated);
  };

  const handleRemoveItem = (index) => {
    if (confirm("Remove this item from your cart?")) {
      const updated = cart.filter((_, i) => i !== index);
      updateCart(updated);
    }
  };

  const handleClearCart = () => {
    if (confirm("Clear your entire cart?")) {
      updateCart([]);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-6">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-4xl font-bold text-green-700">🛒 Shopping Cart</h1>
          {cart.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-700 text-sm font-bold transition cursor-pointer"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Order healthy, personalized meals delivered fresh to your door.</p>
            <button
              onClick={() => navigate("/home")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer shadow"
            >
              Explore Recipes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item, index) => (
                <div
                  key={`${item.recipeId}-${item.hotelName}-${index}`}
                  className="bg-white border rounded-3xl p-6 shadow-sm flex gap-4 items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-2xl border"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-orange-600 font-medium">🏨 {item.hotelName}</p>
                      <p className="text-sm text-gray-400 mt-0.5">₹{item.price} per dish</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 font-bold text-xs transition cursor-pointer"
                    >
                      Remove
                    </button>
                    
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => handleQuantityChange(index, -1)}
                        className="px-3 py-1.5 hover:bg-gray-100 font-bold transition text-gray-700"
                      >
                        -
                      </button>
                      <span className="px-3 font-bold text-gray-800 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(index, 1)}
                        className="px-3 py-1.5 hover:bg-gray-100 font-bold transition text-gray-700"
                      >
                        +
                      </button>
                    </div>
                    
                    <span className="font-bold text-gray-800 text-lg">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total / Checkout Summary */}
            <div className="bg-white border rounded-3xl p-6 shadow-sm h-fit space-y-6">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-3">Bill Details</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Items Total</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 pb-2 border-b border-dashed">
                  <span>Taxes & Charges</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between font-extrabold text-gray-800 text-lg pt-2">
                  <span>To Pay</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/payment")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow transition cursor-pointer text-center"
              >
                Proceed to Payment (₹{totalAmount})
              </button>
            </div>

          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
