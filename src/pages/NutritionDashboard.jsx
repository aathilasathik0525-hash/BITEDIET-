import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import allRecipes from "../data/recipeCatalog";

function NutritionDashboard() {
  const navigate = useNavigate();
  const [nutritionTotals, setNutritionTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    totalPlannedMeals: 0
  });

  useEffect(() => {
    const savedPlanner = localStorage.getItem("weeklyMealPlanner");
    if (!savedPlanner) return;

    const planner = JSON.parse(savedPlanner);
    let caloriesSum = 0;
    let proteinSum = 0;
    let carbsSum = 0;
    let fatSum = 0;
    let count = 0;

    Object.values(planner).forEach((dayMeals) => {
      Object.values(dayMeals).forEach((meal) => {
        if (meal && meal.id) {
          // Look up full recipe from dataset to get precise nutrition values
          const recipe = allRecipes.find((r) => r.id === meal.id);
          if (recipe) {
            count++;
            
            // Parse numerical values
            const cal = parseInt(recipe.calories) || 0;
            const prot = parseInt(recipe.protein) || 0;
            const carb = parseInt(recipe.carbohydrates || recipe.carbs) || 0;
            const f = parseInt(recipe.fat) || 0;

            caloriesSum += cal;
            proteinSum += prot;
            carbsSum += carb;
            fatSum += f;
          }
        }
      });
    });

    setNutritionTotals({
      calories: caloriesSum,
      protein: proteinSum,
      carbs: carbsSum,
      fat: fatSum,
      totalPlannedMeals: count
    });
  }, []);

  // Targets (Weekly benchmarks)
  const targets = {
    calories: 14000, // 2000 kcal per day * 7
    protein: 350,   // 50g per day * 7
    carbs: 1925,    // 275g per day * 7
    fat: 490        // 70g per day * 7
  };

  const getPercent = (value, target) => {
    if (target === 0) return 0;
    return Math.min(100, Math.round((value / target) * 100));
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-green-700">📊 Nutrition Dashboard</h1>
            <p className="text-gray-500 mt-1">Track the cumulative nutrition profile of your weekly meal planner.</p>
          </div>
          <button
            onClick={() => navigate("/meal-planner")}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition cursor-pointer"
          >
            📅 Go to Meal Planner
          </button>
        </div>

        {nutritionTotals.totalPlannedMeals === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-3xl p-8 text-center text-green-800">
            <h3 className="text-2xl font-bold mb-2">🥗 No meals planned yet</h3>
            <p className="text-lg">Add recipes to your days in the Weekly Meal Planner to see your total nutritional summary.</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Quick Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-green-50 p-6 rounded-3xl border border-green-200">
                <h4 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Total Calories</h4>
                <p className="text-3xl font-extrabold text-green-800 mt-2">{nutritionTotals.calories} kcal</p>
                <p className="text-xs text-gray-400 mt-1">Target: {targets.calories} kcal/wk</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-200">
                <h4 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Total Protein</h4>
                <p className="text-3xl font-extrabold text-blue-800 mt-2">{nutritionTotals.protein}g</p>
                <p className="text-xs text-gray-400 mt-1">Target: {targets.protein}g/wk</p>
              </div>

              <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-200">
                <h4 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Carbohydrates</h4>
                <p className="text-3xl font-extrabold text-yellow-800 mt-2">{nutritionTotals.carbs}g</p>
                <p className="text-xs text-gray-400 mt-1">Target: {targets.carbs}g/wk</p>
              </div>

              <div className="bg-purple-50 p-6 rounded-3xl border border-purple-200">
                <h4 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Total Fat</h4>
                <p className="text-3xl font-extrabold text-purple-800 mt-2">{nutritionTotals.fat}g</p>
                <p className="text-xs text-gray-400 mt-1">Target: {targets.fat}g/wk</p>
              </div>
            </div>

            {/* Detailed Progress Bars */}
            <div className="bg-white border border-gray-150 rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">🎯 Weekly Target Completion</h3>
              
              {/* Calories Bar */}
              <div>
                <div className="flex justify-between font-bold text-gray-700 mb-2">
                  <span>Calories ({getPercent(nutritionTotals.calories, targets.calories)}%)</span>
                  <span>{nutritionTotals.calories} / {targets.calories} kcal</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${getPercent(nutritionTotals.calories, targets.calories)}%` }}
                  />
                </div>
              </div>

              {/* Protein Bar */}
              <div>
                <div className="flex justify-between font-bold text-gray-700 mb-2">
                  <span>Protein ({getPercent(nutritionTotals.protein, targets.protein)}%)</span>
                  <span>{nutritionTotals.protein} / {targets.protein}g</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${getPercent(nutritionTotals.protein, targets.protein)}%` }}
                  />
                </div>
              </div>

              {/* Carbs Bar */}
              <div>
                <div className="flex justify-between font-bold text-gray-700 mb-2">
                  <span>Carbohydrates ({getPercent(nutritionTotals.carbs, targets.carbs)}%)</span>
                  <span>{nutritionTotals.carbs} / {targets.carbs}g</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-yellow-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${getPercent(nutritionTotals.carbs, targets.carbs)}%` }}
                  />
                </div>
              </div>

              {/* Fat Bar */}
              <div>
                <div className="flex justify-between font-bold text-gray-700 mb-2">
                  <span>Fat ({getPercent(nutritionTotals.fat, targets.fat)}%)</span>
                  <span>{nutritionTotals.fat} / {targets.fat}g</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${getPercent(nutritionTotals.fat, targets.fat)}%` }}
                  />
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}

export default NutritionDashboard;
