import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function Payment() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentForm, setPaymentForm] = useState({
    upiId: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      const parsed = JSON.parse(saved);
      setCart(parsed);
      if (parsed.length === 0) {
        navigate("/cart");
      }
    } else {
      navigate("/cart");
    }
  }, [navigate]);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (paymentMethod === "upi" && !paymentForm.upiId.trim()) {
      alert("Please enter a valid UPI ID.");
      return;
    }
    if (paymentMethod === "card") {
      if (
        paymentForm.cardNumber.length < 16 ||
        !paymentForm.cardExpiry.includes("/") ||
        paymentForm.cardCvv.length < 3
      ) {
        alert("Please fill in valid Card Details.");
        return;
      }
    }

    // Generate unique Order ID
    const orderId = "BD-" + Math.floor(Math.random() * 900000 + 100000);

    const user = JSON.parse(localStorage.getItem("userProfile")) || {};
    const userEmail = user.email || "guest@bitediet.com";
    const now = new Date();
    const dateTime = now.toLocaleString();

    const orderDetails = {
      orderId,
      userEmail,
      hotelName: cart[0]?.hotelName || "Restaurant",
      dishes: cart.map(item => ({
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount,
      status: "Preparing",
      dateTime
    };

    // Save order details
    localStorage.setItem("lastOrder", JSON.stringify(orderDetails));
    
    // Save to user persistent orders history
    const existingOrders = JSON.parse(localStorage.getItem("userOrders") || "[]");
    localStorage.setItem("userOrders", JSON.stringify([orderDetails, ...existingOrders]));

    // Clear the cart
    localStorage.removeItem("cart");

    alert("Payment Successful! Order Placed ✅");
    navigate("/order-confirmation");
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-6">
        <h1 className="text-4xl font-bold text-green-700 mb-8 border-b pb-4">💳 Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: PAYMENT OPTIONS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Select Payment Method</h3>
              
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                
                {/* UPI Option */}
                <div className="border rounded-2xl p-4 bg-gray-50 flex flex-col gap-3">
                  <label className="flex items-center gap-3 font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span>UPI Payment (GPay / PhonePe / Paytm)</span>
                  </label>
                  {paymentMethod === "upi" && (
                    <input
                      type="text"
                      placeholder="e.g. username@okhdfcbank"
                      value={paymentForm.upiId}
                      onChange={(e) => setPaymentForm({ ...paymentForm, upiId: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-white text-gray-700 focus:ring-1 focus:ring-green-500 outline-none"
                    />
                  )}
                </div>

                {/* Card Payment Option */}
                <div className="border rounded-2xl p-4 bg-gray-50 flex flex-col gap-3">
                  <label className="flex items-center gap-3 font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span>Credit / Debit Card</span>
                  </label>
                  {paymentMethod === "card" && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Card Number"
                        maxLength="16"
                        value={paymentForm.cardNumber}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value.replace(/\D/g, "") })}
                        className="w-full p-3 border rounded-xl bg-white text-gray-700 focus:ring-1 focus:ring-green-500 outline-none"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength="5"
                          value={paymentForm.cardExpiry}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cardExpiry: e.target.value })}
                          className="p-3 border rounded-xl bg-white text-gray-700 focus:ring-1 focus:ring-green-500 outline-none text-center"
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          maxLength="3"
                          value={paymentForm.cardCvv}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cardCvv: e.target.value.replace(/\D/g, "") })}
                          className="p-3 border rounded-xl bg-white text-gray-700 focus:ring-1 focus:ring-green-500 outline-none text-center"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery Option */}
                <div className="border rounded-2xl p-4 bg-gray-50 flex flex-col gap-3">
                  <label className="flex items-center gap-3 font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                  {paymentMethod === "cod" && (
                    <p className="text-xs text-gray-500 bg-orange-50 text-orange-850 p-2.5 rounded-lg border border-orange-200">
                      📝 Pay in cash or scan code during delivery. Safe & contact-free.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow transition cursor-pointer text-center"
                >
                  Pay & Place Order (₹{totalAmount})
                </button>

              </form>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="bg-white border rounded-3xl p-6 shadow-sm h-fit space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-3">Order Summary</h3>
            
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-sm">
                  <div>
                    <span className="font-bold text-gray-700">{item.name}</span>
                    <p className="text-xs text-orange-600 font-medium">🏨 {item.hotelName}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-gray-800">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between font-extrabold text-gray-800 text-lg">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Payment;
