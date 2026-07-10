import { useNavigate } from "react-router-dom";

function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <img
        src={recipe.image}
        alt={recipe.title || recipe.name}
        className="h-48 w-full object-cover rounded-xl"
      />

      <h2 className="text-xl font-bold mt-3">{recipe.name}</h2>
      <p className="text-gray-500">{recipe.mealType || recipe.category} • {recipe.disease}</p>

      <button
        onClick={() => navigate(`/recipe/${recipe.id}`)}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl"
      >
        View Recipe
      </button>
    </div>
  );
}

export default RecipeCard;