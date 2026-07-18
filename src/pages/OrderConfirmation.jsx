import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function OrderConfirmation() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("lastOrder");
    if (saved) {
      setOrder(JSON.parse(saved));
    } else {
      navigate("/home");
    }
  }, [navigate]);

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto p-6 mt-20 text-center">
          <p className="text-gray-500">Loading order status...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 mt-12">
        <div className="bg-white border border-green-100 rounded-3xl p-8 shadow-md text-center flex flex-col items-center">
          
          {/* Animated Green Badge */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-green-500 shadow-inner mb-6 text-4xl animate-bounce">
            🎉
          </div>

          <h1 className="text-4xl font-extrabold text-green-700">Order Confirmed!</h1>
          <p className="text-gray-500 mt-2">Thank you for your order! Your delicious and healthy food is on the way.</p>

          {/* Details Box */}
          <div className="w-full bg-green-50/50 border border-green-150 rounded-2xl p-6 mt-8 space-y-4 text-left">
            <div className="flex justify-between border-b pb-3 border-green-200">
              <span className="font-semibold text-green-900">Order ID:</span>
              <span className="font-bold text-green-800">{order.orderId}</span>
            </div>
            
            <div className="flex justify-between border-b pb-3 border-green-200">
              <span className="font-semibold text-green-900">Restaurant:</span>
              <span className="font-bold text-green-850">{order.hotelName}</span>
            </div>

            <div>
              <span className="font-semibold text-green-900 block mb-2">Ordered Items:</span>
              <ul className="space-y-1">
                {order.dishes.map((dish, idx) => (
                  <li key={idx} className="flex justify-between text-sm text-green-800">
                    <span>{dish.name} (x{dish.quantity})</span>
                    <span className="font-semibold">₹{dish.price * dish.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between border-t pt-3 border-green-200 font-extrabold text-green-900 text-lg">
              <span>Total Paid:</span>
              <span>₹{order.totalAmount}</span>
            </div>

            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-green-200 mt-4">
              <span className="font-semibold text-green-900">Estimated Delivery:</span>
              <span className="font-bold text-orange-600">30 - 40 mins</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3.5 rounded-xl shadow transition cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
}

export default OrderConfirmation;
