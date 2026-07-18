import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import allRecipes from "../data/recipeCatalog";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_SLOTS = ["Breakfast", "Lunch", "Dinner"];

function MealPlanner() {
  const navigate = useNavigate();
  const patientType = localStorage.getItem("patientType") || "Normal";
  const patientRecipes = allRecipes.filter((r) => r.disease === patientType);

  const [planner, setPlanner] = useState(() => {
    const saved = localStorage.getItem("weeklyMealPlanner");
    if (saved) return JSON.parse(saved);
    
    // Initialize empty planner structure
    const initial = {};
    DAYS_OF_WEEK.forEach((day) => {
      initial[day] = { Breakfast: null, Lunch: null, Dinner: null };
    });
    return initial;
  });

  const handleSelectMeal = (day, slot, recipeId) => {
    const updated = { ...planner };
    if (recipeId === "") {
      updated[day][slot] = null;
    } else {
      const selected = patientRecipes.find((r) => r.id === Number(recipeId));
      updated[day][slot] = selected ? { id: selected.id, name: selected.name, calories: selected.calories } : null;
    }
    setPlanner(updated);
    localStorage.setItem("weeklyMealPlanner", JSON.stringify(updated));
  };

  const handleRemoveMeal = (day, slot) => {
    const updated = { ...planner };
    updated[day][slot] = null;
    setPlanner(updated);
    localStorage.setItem("weeklyMealPlanner", JSON.stringify(updated));
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-green-700">📅 Weekly Meal Planner</h1>
            <p className="text-gray-500 mt-1">Plan your breakfast, lunch, and dinner using recipes for your health category ({patientType}).</p>
          </div>
          <button
            onClick={() => navigate("/nutrition-dashboard")}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition cursor-pointer"
          >
            📊 View Nutrition Summary
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm hover:shadow transition-shadow">
              <h2 className="text-2xl font-bold text-green-800 border-b pb-3 mb-4">{day}</h2>
              
              <div className="space-y-4">
                {MEAL_SLOTS.map((slot) => {
                  const savedMeal = planner[day][slot];
                  return (
                    <div key={slot} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-500 text-sm uppercase tracking-wider">{slot}</span>
                        {savedMeal && (
                          <button
                            onClick={() => handleRemoveMeal(day, slot)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold transition cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {savedMeal ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex justify-between items-center">
                          <span className="font-semibold text-green-900 line-clamp-1">{savedMeal.name}</span>
                          <span className="text-xs bg-green-200 text-green-800 px-2.5 py-1 rounded-full font-bold">
                            {savedMeal.calories} kcal
                          </span>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-3 text-center text-sm text-gray-400">
                          No recipe selected
                        </div>
                      )}

                      <select
                        value={savedMeal ? savedMeal.id : ""}
                        onChange={(e) => handleSelectMeal(day, slot, e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                      >
                        <option value="">-- Choose Recipe --</option>
                        {patientRecipes.map((recipe) => (
                          <option key={recipe.id} value={recipe.id}>
                            {recipe.name} ({recipe.calories} kcal)
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MealPlanner;
