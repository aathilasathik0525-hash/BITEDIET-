import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import allRecipes from "../data/recipeCatalog";
import Navbar from "../components/layout/Navbar";

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const recipe = allRecipes.find((r) => r.id === Number(id));

  if (!recipe) {
    return <h1 className="text-center mt-20 text-3xl">Recipe Not Found</h1>;
  }

  const instructions = recipe.instructions || recipe.procedure || [];
  const ingredientList = recipe.ingredients || [];

  // Cooking Timer States
  const [durationInput, setDurationInput] = useState(() => {
    const match = String(recipe.cookingTime || "").match(/\d+/);
    return match ? match[0] : "10";
  });
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
  };

  const handleStart = () => {
    const totalSecs = parseInt(durationInput, 10) * 60;
    if (isNaN(totalSecs) || totalSecs <= 0) return;
    setTimeLeft(totalSecs);
    setIsRunning(true);
    setIsFinished(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setIsFinished(false);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-64 md:h-96 object-cover rounded-3xl shadow-lg"
        />

        <h1 className="text-3xl md:text-5xl font-bold mt-8">{recipe.name}</h1>

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

      {/* Cooking Timer Section */}
      <div className="mt-10 p-6 bg-green-50 border border-green-200 rounded-3xl">
        <h2 className="text-2xl font-bold mb-4 text-green-800 flex items-center gap-2">⏱️ Cooking Timer</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={durationInput}
              onChange={(e) => setDurationInput(e.target.value)}
              disabled={isRunning || timeLeft > 0}
              className="w-20 p-2 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-lg bg-white"
              min="1"
            />
            <span className="text-lg font-medium text-green-700">minutes</span>
          </div>

          <div className="flex gap-2">
            {timeLeft === 0 && !isFinished ? (
              <button
                onClick={handleStart}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold transition cursor-pointer"
              >
                Start Cooking Timer
              </button>
            ) : (
              <>
                {isRunning ? (
                  <button
                    onClick={handlePause}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-xl font-semibold transition cursor-pointer"
                  >
                    Pause
                  </button>
                ) : (
                  timeLeft > 0 && (
                    <button
                      onClick={handleResume}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold transition cursor-pointer"
                    >
                      Resume
                    </button>
                  )
                )}
                <button
                  onClick={handleReset}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold transition cursor-pointer"
                >
                  Reset
                </button>
              </>
            )}
          </div>
        </div>

        {timeLeft > 0 && (
          <div className="mt-4 text-4xl font-mono font-bold text-green-700">
            {formatTime(timeLeft)}
          </div>
        )}

        {isFinished && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-xl font-bold text-center text-lg animate-pulse">
            ⏰ Time's up! Your cooking is finished! Bon Appétit!
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-8 flex-wrap">
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
          className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 cursor-pointer font-bold"
        >
          ❤️ Save to Cookbook
        </button>

        <button
          onClick={() => navigate(`/select-hotel/${recipe.id}`)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl cursor-pointer font-bold flex items-center gap-2 shadow"
        >
          🛒 Order from Hotel
        </button>
      </div>

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

      {recipe.healthBenefits && (
        <div className="mt-10">
          <h2 className="text-3xl font-bold">Health Benefits</h2>
          <p className="mt-4 text-gray-700 leading-relaxed bg-green-50 p-4 rounded-xl border border-green-200">
            {recipe.healthBenefits}
          </p>
        </div>
      )}
      </div>
    </>
  );
}

export default RecipeDetails;