import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import SearchBar from "../components/common/SearchBar";
import Categories from "../components/home/Categories";
import RecipeCard from "../components/recipe/RecipeCard";

import { getRecipesByPatientType } from "../data/recipeCatalog";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

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

  return (
    <>
      <Navbar />
      <Hero />
      <div className="max-w-7xl mx-auto px-6 mt-6 flex justify-end">
  <button
    onClick={() => window.location.href = "/cookbook"}
    className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700"
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
              className={`px-5 py-2 rounded-full border ${
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

      <Categories />

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