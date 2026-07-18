import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import SearchBar from "../components/common/SearchBar";
import RecipeCard from "../components/recipe/RecipeCard";

import { getRecipesByPatientType } from "../data/recipeCatalog";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  // What's In My Fridge States
  const [fridgeIngredients, setFridgeIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [isFridgeActive, setIsFridgeActive] = useState(false);

  const selectedType =
    localStorage.getItem("patientType") || "Normal";

  const allRecipes = getRecipesByPatientType(selectedType);

  const filteredRecipes = allRecipes.filter((r) => {
    const matchDisease = r.disease === selectedType;

    const recipeCategory = String(r.mealType || r.category || "").toLowerCase();
    const selectedCategoryValue = String(selectedCategory || "All").toLowerCase();

    const matchCategory =
      selectedCategoryValue === "all" ||
      recipeCategory === selectedCategoryValue ||
      (selectedCategoryValue === "snacks" && recipeCategory === "snack") ||
      (selectedCategoryValue === "drinks" && recipeCategory === "drink") ||
      (selectedCategoryValue === "snack" && recipeCategory === "snacks") ||
      (selectedCategoryValue === "drink" && recipeCategory === "drinks");

    const matchSearch =
      (r.title || r.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchDisease && matchCategory && matchSearch;
  });

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (newIngredient.trim() && !fridgeIngredients.includes(newIngredient.trim())) {
      setFridgeIngredients([...fridgeIngredients, newIngredient.trim()]);
      setNewIngredient("");
      setIsFridgeActive(false);
    }
  };

  const handleRemoveIngredient = (ing) => {
    setFridgeIngredients(fridgeIngredients.filter((i) => i !== ing));
    setIsFridgeActive(false);
  };

  const fridgeRecipes = allRecipes.filter((r) => {
    if (r.disease !== selectedType) return false;
    return fridgeIngredients.some((fridgeIng) =>
      r.ingredients.some((recipeIng) =>
        String(recipeIng).toLowerCase().includes(fridgeIng.toLowerCase())
      )
    );
  });

  return (
    <>
      <Navbar />
      <Hero />
      <div className="max-w-7xl mx-auto px-6 mt-6 flex justify-end">
        <button
          onClick={() => window.location.href = "/cookbook"}
          className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 cursor-pointer"
        >
          ❤️ My Cookbook
        </button>
      </div>
      <SearchBar
        search={search}
        setSearch={setSearch}
      />
      {/* CATEGORY FILTER */}
      <div className="max-w-7xl mx-auto px-6 mt-6 flex flex-wrap gap-4">
        {["All", "Breakfast", "Lunch", "Dinner", "Snack", "Drink"].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full border cursor-pointer ${
                selectedCategory === cat
                  ? "bg-green-600 text-white"
                  : "bg-white text-green-600"
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* WHAT'S IN MY FRIDGE SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-10 bg-green-50 rounded-3xl border border-green-200 mt-10">
        <h2 className="text-3xl font-bold mb-4 text-green-800 flex items-center gap-2">🥬 What's In My Fridge?</h2>
        <p className="text-gray-600 mb-6">Enter the ingredients you have on hand, and we will find recipes you can make!</p>
        
        <form onSubmit={handleAddIngredient} className="flex gap-2 max-w-md mb-6">
          <input
            type="text"
            placeholder="e.g. Onion, Chicken, Spinach..."
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            className="flex-1 p-3 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
          >
            Add
          </button>
        </form>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {fridgeIngredients.map((ing) => (
            <span
              key={ing}
              className="bg-green-200 text-green-800 px-4 py-2 rounded-full font-medium flex items-center gap-2 border border-green-300"
            >
              {ing}
              <button
                type="button"
                onClick={() => handleRemoveIngredient(ing)}
                className="text-red-500 hover:text-red-700 font-bold focus:outline-none cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {fridgeIngredients.length > 0 && (
          <div className="flex gap-4">
            <button
              onClick={() => setIsFridgeActive(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition cursor-pointer"
            >
              Find Recipes
            </button>
            <button
              onClick={() => {
                setFridgeIngredients([]);
                setIsFridgeActive(false);
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold transition cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Fridge Search Results */}
        {isFridgeActive && (
          <div className="mt-8 pt-8 border-t border-green-200">
            <h3 className="text-2xl font-bold mb-6 text-green-800">
              Matching Recipes ({fridgeRecipes.length})
            </h3>
            {fridgeRecipes.length === 0 ? (
              <p className="text-xl text-gray-500">No matching recipes found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {fridgeRecipes.map((recipe) => (
                  <RecipeCard key={`fridge-${recipe.id}`} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* RECIPES */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6">
          Recommended Recipes ({selectedType})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;