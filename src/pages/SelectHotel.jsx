import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import allRecipes from "../data/recipeCatalog";
import HOTELS from "../data/hotels";

function SelectHotel() {
  const { recipeId } = useParams();
  const navigate = useNavigate();

  const recipe = allRecipes.find((r) => r.id === Number(recipeId));
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [quantity, setQuantity] = useState(1);

  if (!recipe) {
    return (
      <>
        <Navbar />
        <h1 className="text-center mt-20 text-3xl">Recipe Not Found</h1>
      </>
    );
  }

  // Filter hotels that offer this specific dish
  const matchedHotels = HOTELS.filter((hotel) =>
    hotel.dishes.some(
      (dishName) =>
        dishName.toLowerCase().includes(recipe.name.toLowerCase()) ||
        recipe.name.toLowerCase().includes(dishName.toLowerCase())
    )
  );

  // Fallback: If no direct matches, show hotels from the same city or top-rated ones so ordering always works
  const hotelsToDisplay = matchedHotels.length > 0 ? matchedHotels : HOTELS.slice(0, 8);

  const price = 120 + (recipe.id % 5) * 30; // Reliable calculation for price

  const handleAddToCart = () => {
    if (!selectedHotel) {
      alert("Please select a hotel first.");
      return;
    }

    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Add item to cart
    const newItem = {
      recipeId: recipe.id,
      name: recipe.name,
      image: recipe.image,
      hotelName: selectedHotel.name,
      city: selectedHotel.city,
      rating: selectedHotel.rating,
      price: price,
      quantity: quantity
    };

    currentCart.push(newItem);
    localStorage.setItem("cart", JSON.stringify(currentCart));

    alert(`Added ${quantity} x ${recipe.name} from ${selectedHotel.name} to your cart! 🛒`);
    navigate("/cart");
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 mt-6">
        <h1 className="text-4xl font-bold text-green-700 mb-2">🏨 Select a Restaurant</h1>
        <p className="text-gray-500 mb-6">Choose a restaurant that serves <span className="font-semibold text-green-600">"{recipe.name}"</span>.</p>

        {/* Selected Hotel Preview Banner */}
        {selectedHotel && (
          <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Selected Restaurant</span>
              <h3 className="text-2xl font-bold text-orange-950 mt-1">{selectedHotel.name}</h3>
              <p className="text-sm text-orange-850 mt-0.5">{selectedHotel.tag} • ⭐ {selectedHotel.rating} ({selectedHotel.city})</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-orange-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-orange-100 text-orange-800 font-bold transition"
                >
                  -
                </button>
                <span className="px-4 font-bold text-orange-950">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-orange-100 text-orange-800 font-bold transition"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl shadow transition cursor-pointer"
              >
                Add Dish to Cart (₹{price * quantity})
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotelsToDisplay.map((hotel) => (
            <div
              key={hotel.id}
              onClick={() => setSelectedHotel(hotel)}
              className={`border-2 rounded-3xl p-6 transition cursor-pointer flex flex-col justify-between ${
                selectedHotel?.id === hotel.id
                  ? "border-orange-500 bg-orange-50/50 shadow-md"
                  : "border-gray-200 hover:border-orange-300 bg-white hover:shadow-sm"
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h2 className="text-2xl font-bold text-gray-800">{hotel.name}</h2>
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-bold px-3 py-1 rounded-full border border-yellow-250 flex items-center gap-1">
                    ⭐ {hotel.rating}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-wider">{hotel.tag}</p>
                <p className="text-gray-500 text-sm mt-0.5">📍 {hotel.city}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-450 font-bold uppercase tracking-wider">Available Dishes:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {hotel.dishes.slice(0, 4).map((dish) => (
                    <span key={dish} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                      {dish}
                    </span>
                  ))}
                  {hotel.dishes.length > 4 && (
                    <span className="text-xs bg-gray-550 text-white px-2 py-0.5 rounded-full font-bold">
                      +{hotel.dishes.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SelectHotel;
