import { useParams } from "react-router-dom";
import allRecipes from "../data/recipeCatalog";

function RecipeDetails() {
  const { id } = useParams();

  const recipe = allRecipes.find((r) => r.id === Number(id));

  if (!recipe) {
    return <h1 className="text-center mt-20 text-3xl">Recipe Not Found</h1>;
  }

  const instructions = recipe.instructions || recipe.procedure || [];
  const ingredientList = recipe.ingredients || [];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-96 object-cover rounded-3xl shadow-lg"
      />

      <h1 className="text-5xl font-bold mt-8">{recipe.name}</h1>

      <p className="text-gray-600 mt-2">
        {recipe.mealType || recipe.category} • {recipe.disease}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
        <div className="bg-green-100 p-4 rounded-xl">
          <h3>Calories</h3>
          <p>{recipe.calories}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded-xl">
          <h3>Protein</h3>
          <p>{recipe.protein}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded-xl">
          <h3>Carbohydrates</h3>
          <p>{recipe.carbohydrates || recipe.carbs}</p>
        </div>

        <div className="bg-red-100 p-4 rounded-xl">
          <h3>Fat</h3>
          <p>{recipe.fat}</p>
        </div>

        <div className="bg-purple-100 p-4 rounded-xl">
          <h3>Fiber</h3>
          <p>{recipe.fiber}</p>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Cooking Time</h2>
          <p className="mt-2">{recipe.cookingTime}</p>
        </div>
        <div>
          <h2 className="text-3xl font-bold">Servings</h2>
          <p className="mt-2">{recipe.servings}</p>
        </div>
      </div>

      <button
        onClick={() => {
          const saved = JSON.parse(localStorage.getItem("cookbook")) || [];

          if (!saved.includes(recipe.id)) {
            saved.push(recipe.id);
            localStorage.setItem("cookbook", JSON.stringify(saved));
            alert("Recipe saved to Cookbook ❤️");
          } else {
            alert("Recipe already saved!");
          }
        }}
        className="mt-8 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
      >
        ❤️ Save to Cookbook
      </button>

      <div className="mt-10">
        <h2 className="text-3xl font-bold">Ingredients</h2>
        <ul className="list-disc ml-8 mt-4">
          {ingredientList.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-bold">Cooking Procedure</h2>
        <ol className="list-decimal ml-8 mt-4 space-y-3">
          {instructions.map((step, index) => (
            <li key={`${step}-${index}`}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default RecipeDetails;