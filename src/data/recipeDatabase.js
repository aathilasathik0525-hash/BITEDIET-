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

function getCategoryByKeywords(title, originalCategory) {
  const lower = String(title).toLowerCase();
  
  if (lower.match(/smoothie|tea|coffee|juice|shake|milk|drink|beverage|shorba|soup|rasam|thandai|lassi/i)) {
    return 'Drink';
  }
  if (lower.match(/idli|dosa|chilla|upma|poha|breakfast|paratha|puri|toast|porridge|oats|pancake|roti|appam|puttu|bhurji|pongal|cheela/i)) {
    return 'Breakfast';
  }
  if (lower.match(/chutney|pachadi|ladoo|kheer|halwa|bite|fritter|tikki|chaat|makhana|snack|appetizer|custard|jalebi|barfi|samosa|rasgulla|jamun|kachori|dhokla|vada|pakora|bhel/i)) {
    return 'Snack';
  }
  if (lower.match(/pulao|rice|sambar|kootu|thoran|curry|dal|gravy|stew|sabzi|biryani|rogan|korma|masala|kofta|kurma|paneer|chicken|fish|mutton|egg|bhindi|gobhi|aloo|baingan|undhiyu|bharta/i)) {
    return (title.length % 2 === 0) ? 'Lunch' : 'Dinner';
  }
  
  return normalizeMealType(originalCategory);
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
    difficulty: recipe.difficulty || (
      (() => {
        const mins = parseInt(String(recipe.cookingTime || recipe.cookTime || '').match(/\d+/)?.[0] || '20', 10);
        return mins <= 20 ? 'Easy' : mins <= 40 ? 'Medium' : 'Hard';
      })()
    ),
    servings: recipe.servings || '—',
    healthBenefits: recipe.healthBenefits || '',
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
