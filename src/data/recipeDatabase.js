import diabeticSource from './diabeticRecipes.js';
import bpSource from './bpRecipes.js';
import normalSource from './normalRecipes.js';

const mealTypeMap = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
  snacks: 'Snack',
  drink: 'Drink',
  drinks: 'Drink',
};

function normalizeMealType(value) {
  if (!value) return 'Dinner';
  const normalized = String(value).trim().toLowerCase();
  return mealTypeMap[normalized] || 'Dinner';
}

function normalizeRecipe(recipe, disease, index) {
  const title = recipe.title || recipe.name || `Recipe ${index + 1}`;
  const mealType = normalizeMealType(recipe.category || recipe.mealType);

  return {
    id: recipe.id || index + 1,
    title,
    name: recipe.name || title,
    disease,
    category: mealType,
    mealType,
    image: recipe.image || '',
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
    procedure: Array.isArray(recipe.procedure)
      ? recipe.procedure
      : Array.isArray(recipe.instructions)
        ? recipe.instructions
        : [],
    instructions: Array.isArray(recipe.instructions)
      ? recipe.instructions
      : Array.isArray(recipe.procedure)
        ? recipe.procedure
        : [],
    calories: recipe.calories || '—',
    protein: recipe.protein || '—',
    carbohydrates: recipe.carbohydrates || recipe.carbs || '—',
    carbs: recipe.carbs || recipe.carbohydrates || '—',
    fat: recipe.fat || '—',
    fiber: recipe.fiber || '—',
    cookingTime: recipe.cookingTime || recipe.cookTime || '—',
    servings: recipe.servings || '—',
    source: recipe.source || 'Trusted food dataset',
  };
}

function deduplicateRecipes(recipes) {
  const seen = new Set();
  return recipes.filter((recipe) => {
    const key = (recipe.title || recipe.name || '').toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const diabeticRecipes = deduplicateRecipes(
  diabeticSource.map((recipe, index) => normalizeRecipe(recipe, 'Diabetes', index))
);

export const bpRecipes = deduplicateRecipes(
  bpSource.map((recipe, index) => normalizeRecipe(recipe, 'Blood Pressure', index))
);

export const normalRecipes = deduplicateRecipes(
  normalSource.map((recipe, index) => normalizeRecipe(recipe, 'Normal', index))
);

export const allRecipes = [...diabeticRecipes, ...bpRecipes, ...normalRecipes];

export function getRecipesByPatientType(patientType) {
  const normalized = String(patientType || 'Normal').toLowerCase();

  if (normalized.includes('diab')) return diabeticRecipes;
  if (normalized.includes('blood') || normalized.includes('pressure')) return bpRecipes;
  return normalRecipes;
}

export default allRecipes;
