import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userProfile"));
    if (!user) {
      navigate("/login");
      return;
    }
    setUserEmail(user.email);

    const savedOrders = JSON.parse(localStorage.getItem("userOrders") || "[]");
    // Filter orders specifically for the logged-in user
    const filtered = savedOrders.filter(o => o.userEmail === user.email);
    setOrders(filtered);
  }, [navigate]);

  // Dynamically calculate status based on order age to create a premium simulation
  const getOrderStatus = (order) => {
    if (!order.dateTime) return "Preparing";
    const orderTime = new Date(order.dateTime).getTime();
    if (isNaN(orderTime)) return order.status || "Preparing";
    
    const diffMins = (Date.now() - orderTime) / 60000;
    if (diffMins > 10) return "Delivered";
    if (diffMins > 3) return "Out for Delivery";
    return "Preparing";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Out for Delivery":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-orange-100 text-orange-850 border-orange-200 animate-pulse";
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-6">
        <h1 className="text-4xl font-bold text-green-700 mb-8 border-b pb-4">📋 My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-2">You haven't placed any orders yet.</h2>
            <p className="text-gray-500 mb-6 font-medium">Start ordering healthy, personalized meals from the best restaurants!</p>
            <button
              onClick={() => navigate("/home")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer shadow"
            >
              Order Now
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, index) => {
              const currentStatus = getOrderStatus(order);
              return (
                <div
                  key={order.orderId || index}
                  className="bg-white border rounded-3xl p-6 shadow-sm space-y-4 hover:shadow transition-shadow"
                >
                  {/* Order Card Header */}
                  <div className="flex flex-wrap justify-between items-start border-b pb-4 gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-extrabold text-gray-800 text-lg">{order.hotelName}</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(currentStatus)}`}>
                          {currentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Order ID: {order.orderId} • {order.dateTime}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 font-bold uppercase block tracking-wider">Total Paid</span>
                      <span className="font-extrabold text-gray-800 text-lg">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  {/* Dishes Ordered */}
                  <div className="divide-y divide-gray-100">
                    {order.dishes.map((dish, idx) => (
                      <div key={idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          {dish.image && (
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-12 h-12 object-cover rounded-xl border border-gray-100"
                            />
                          )}
                          <div>
                            <span className="font-bold text-gray-700 text-sm">{dish.name}</span>
                            <span className="text-xs text-gray-400 block">Qty: {dish.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold text-gray-800 text-sm">₹{dish.price * dish.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Est. Delivery Time & Track Order Button */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 flex-wrap gap-3">
                    <span className="text-sm font-semibold text-gray-500">
                      ⏱️ Est. Delivery: <span className="text-orange-600 font-bold">30 - 40 mins</span>
                    </span>
                    <button
                      onClick={() => navigate(`/track-order/${order.orderId}`)}
                      className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2 rounded-xl transition cursor-pointer shadow"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default MyOrders;
