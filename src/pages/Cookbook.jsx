import allRecipes from "../data/recipeCatalog";
import Navbar from "../components/layout/Navbar";
import RecipeCard from "../components/recipe/RecipeCard";

function Cookbook() {
  const savedIds = JSON.parse(localStorage.getItem("cookbook")) || [];

  const savedRecipes = allRecipes.filter((recipe) =>
    savedIds.includes(recipe.id)
  );

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 mt-6">
        <h1 className="text-4xl font-bold mb-8 text-green-700">
          ❤️ My Cookbook
        </h1>

        {savedRecipes.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-2xl text-gray-500 font-semibold">No saved recipes yet.</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Cookbook;