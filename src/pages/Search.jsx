import { useState, useEffect, useRef } from "react";
import Navbar from "../components/layout/Navbar";
import RecipeCard from "../components/recipe/RecipeCard";
import allRecipes from "../data/recipeCatalog";
import { Mic } from "lucide-react";

function Search() {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const patientType = localStorage.getItem("patientType") || "Normal";
  const inputRef = useRef(null);

  // Auto-focus the search bar on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please try Google Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  // Filter recipes of the current patient type by query
  const patientRecipes = allRecipes.filter(r => r.disease === patientType);
  const matchedRecipes = patientRecipes.filter((r) =>
    (r.title || r.name || "")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  // Suggestions lists
  const recentSearches = ["Chilla", "Salad", "Soup", "Poha", "Raita"];
  
  // Select a few popular/trending recipes from the active patient category
  const popularRecipes = patientRecipes.slice(0, 3);
  const trendingRecipes = patientRecipes.slice(3, 6);
  const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Drink"];

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 mt-6">
        <h1 className="text-4xl font-bold mb-6 text-green-700">🔍 Search Recipes</h1>
        
        {/* Search Bar */}
        <div className="relative mb-8 flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder={isListening ? "Listening..." : "Search recipes by name..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-2 border-green-300 rounded-2xl p-4 pl-12 pr-20 text-lg focus:outline-none focus:border-green-600 transition-colors"
          />
          <span className="absolute left-4 top-5 text-gray-400 text-xl">🔍</span>
          
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <button
              onClick={handleVoiceSearch}
              type="button"
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                isListening ? "text-red-500 animate-pulse bg-red-50" : "text-gray-500"
              }`}
              title="Search by voice"
            >
              <Mic className="w-5 h-5" />
            </button>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-gray-400 hover:text-gray-600 font-bold px-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {query === "" ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Recent Searches */}
            <div>
              <h3 className="text-xl font-bold text-gray-700 mb-3">🕒 Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="bg-gray-100 hover:bg-green-100 hover:text-green-700 text-gray-600 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xl font-bold text-gray-700 mb-3">🏷️ Recipe Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setQuery(cat)}
                    className="bg-green-50 hover:bg-green-600 hover:text-white text-green-700 px-5 py-2.5 rounded-xl text-sm font-semibold border border-green-200 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Recipes */}
            {popularRecipes.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">🔥 Popular Recipes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {popularRecipes.map((recipe) => (
                    <div
                      key={`pop-${recipe.id}`}
                      onClick={() => setQuery(recipe.name)}
                      className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <img src={recipe.image} alt={recipe.name} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <p className="font-bold text-gray-800 line-clamp-1">{recipe.name}</p>
                        <p className="text-sm text-gray-400 mt-1">{recipe.mealType || recipe.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Recipes */}
            {trendingRecipes.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">📈 Trending Recipes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {trendingRecipes.map((recipe) => (
                    <div
                      key={`trend-${recipe.id}`}
                      onClick={() => setQuery(recipe.name)}
                      className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <img src={recipe.image} alt={recipe.name} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <p className="font-bold text-gray-800 line-clamp-1">{recipe.name}</p>
                        <p className="text-sm text-gray-400 mt-1">{recipe.mealType || recipe.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              Search Results ({matchedRecipes.length})
            </h3>
            {matchedRecipes.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-2xl text-gray-500">No recipes found matching "{query}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
                {matchedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Search;