import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const STAGES = [
  { key: "confirmed", label: "Order Confirmed", minAge: 0 },
  { key: "preparing", label: "Preparing", minAge: 1 },
  { key: "packed", label: "Packed", minAge: 3 },
  { key: "out", label: "Out for Delivery", minAge: 6 },
  { key: "delivered", label: "Delivered", minAge: 10 }
];

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orderAgeMins, setOrderAgeMins] = useState(0);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("userOrders") || "[]");
    const matched = savedOrders.find(o => o.orderId === orderId);
    if (!matched) {
      alert("Order not found!");
      navigate("/my-orders");
      return;
    }
    setOrder(matched);

    // Calculate age immediately
    if (matched.dateTime) {
      const orderTime = new Date(matched.dateTime).getTime();
      if (!isNaN(orderTime)) {
        setOrderAgeMins((Date.now() - orderTime) / 60000);
      }
    }

    // Set up timer to refresh age every 5 seconds to animate the progress bar in real-time
    const interval = setInterval(() => {
      if (matched.dateTime) {
        const orderTime = new Date(matched.dateTime).getTime();
        if (!isNaN(orderTime)) {
          setOrderAgeMins((Date.now() - orderTime) / 60000);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, navigate]);

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto p-6 mt-20 text-center">
          <p className="text-gray-500">Loading tracking status...</p>
        </div>
      </>
    );
  }

  // Determine active stage and status text
  let activeStageIndex = 0;
  STAGES.forEach((stage, idx) => {
    if (orderAgeMins >= stage.minAge) {
      activeStageIndex = idx;
    }
  });

  const currentStatus = STAGES[activeStageIndex].label;

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 mt-6">
        
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-green-700">🚚 Track Order</h1>
            <p className="text-sm text-gray-400 mt-1">Order ID: <span className="font-mono font-bold text-gray-600">{order.orderId}</span></p>
          </div>
          <button
            onClick={() => navigate("/my-orders")}
            className="border border-green-600 text-green-700 hover:bg-green-50 px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer"
          >
            ← Back to Orders
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* TIMELINE COLUMN */}
          <div className="md:col-span-2 bg-white border rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Current Status</span>
              <span className="text-green-700 font-extrabold text-lg">{currentStatus}</span>
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
              {STAGES.map((stage, idx) => {
                const isCompleted = orderAgeMins >= stage.minAge;
                const isActive = activeStageIndex === idx;

                return (
                  <div key={stage.key} className="relative flex gap-4 items-start">
                    
                    {/* Circle Indicator */}
                    <div
                      className={`absolute left-[-28px] w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-green-600 border-green-600 text-white"
                          : "bg-white border-gray-200 text-gray-300"
                      } ${isActive ? "ring-4 ring-green-100 animate-pulse scale-110" : ""}`}
                    >
                      {isCompleted ? (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                      )}
                    </div>

                    <div>
                      <h4 className={`font-bold transition-colors ${
                        isActive ? "text-green-800 text-lg" : isCompleted ? "text-gray-700" : "text-gray-450"
                      }`}>
                        {stage.label}
                      </h4>
                      {isActive && (
                        <p className="text-xs text-orange-500 font-semibold mt-0.5 animate-pulse">
                          Active stage • Your order is currently at this step
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ORDER BRIEF INFO PANEL */}
          <div className="space-y-6">
            <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Restaurant Details</h3>
              <div>
                <span className="font-extrabold text-gray-850 text-base block">{order.hotelName}</span>
                <span className="text-xs text-gray-400 mt-1 block">Placed at: {order.dateTime}</span>
              </div>
            </div>

            <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Items Summary</h3>
              <div className="divide-y divide-gray-100">
                {order.dishes.map((dish, idx) => (
                  <div key={idx} className="flex justify-between py-2.5 first:pt-0 last:pb-0 text-sm">
                    <span className="font-medium text-gray-600">{dish.name} (x{dish.quantity})</span>
                    <span className="font-bold text-gray-800">₹{dish.price * dish.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 flex justify-between font-extrabold text-gray-850 text-base">
                <span>Total Amount:</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-3xl p-5 text-center">
              <span className="text-xs text-orange-850 uppercase font-bold tracking-wider block">Estimated Delivery</span>
              <span className="text-2xl font-black text-orange-950 mt-1 block">30 - 40 mins</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default OrderTracking;
