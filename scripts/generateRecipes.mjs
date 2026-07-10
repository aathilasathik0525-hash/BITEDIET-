import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '..', 'src', 'data');
const mealDbBase = 'https://www.themealdb.com/api/json/v1/1';

const highSugarTerms = [
  ' sugar ', 'honey', 'maple', 'jam', 'caramel', 'chocolate', 'cookie',
  'cake', 'pie', 'pudding', 'custard', 'frosting', 'brownie', 'donut',
  'ice cream', 'syrup', 'sweet', 'dessert', 'banana', 'coconut milk',
  'biscuit', 'pastry', 'molasses', 'marshmallow'
];

const highSodiumTerms = [
  'soy sauce', 'salt', 'bacon', 'ham', 'sausage', 'chorizo', 'anchovy',
  'pickle', 'prosciutto', 'stock cube', 'processed', 'ketchup', 'mustard',
  'miso', 'cured', 'salami', 'jerky', 'nori', 'fish sauce', 'bouillon'
];

const lowSodiumHints = [
  'herb', 'lemon', 'lime', 'garlic', 'ginger', 'turmeric', 'cumin', 'oregano',
  'coriander', 'parsley', 'pepper', 'olive oil', 'olive', 'vegetable', 'lentil',
  'quinoa', 'bean', 'chickpea', 'tofu', 'salad', 'broth', 'grill', 'grilled',
  'roast', 'roasted', 'steamed', 'steak', 'soup', 'yogurt', 'oat', 'chia', 'mushroom'
];

const lowSugarHints = [
  'salad', 'vegetable', 'lentil', 'bean', 'chickpea', 'turkey', 'chicken', 'fish',
  'salmon', 'tofu', 'quinoa', 'broccoli', 'cauliflower', 'cabbage', 'cucumber',
  'mushroom', 'egg', 'oat', 'yogurt', 'soup', 'steak', 'grill', 'grilled', 'roast'
];

function normalizeText(value) {
  return value ? value.replace(/\r/g, '').trim() : '';
}

function toTitleCase(value) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function parseIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i += 1) {
    const name = normalizeText(meal[`strIngredient${i}`]);
    const measure = normalizeText(meal[`strMeasure${i}`]);
    if (!name) continue;
    const display = measure ? `${measure} ${name}` : name;
    ingredients.push(display);
  }
  return ingredients;
}

function parseInstructions(text) {
  if (!text) return ['Prepare the recipe with care and serve warm.'];

  const steps = text
    .split(/\n+/)
    .flatMap((piece) => piece.split(/\.\s+/))
    .map((step) => normalizeText(step.replace(/\s+/g, ' ')))
    .filter(Boolean);

  return steps.length ? steps : ['Prepare the recipe with care and serve warm.'];
}

function getCategory(mealName, ingredientsText) {
  const lower = `${mealName} ${ingredientsText}`.toLowerCase();
  if (/smoothie|tea|coffee|juice|shake|milk|cocktail|punch/i.test(lower)) return 'Drinks';
  if (/omelette|frittata|panc|waff|toast|porridge|muffin|bagel|breakfast|egg/i.test(lower)) return 'Breakfast';
  if (/salad|soup|wrap|sandwich|burger|taco|bowl|rice|quiche|stew|kebab|curry/i.test(lower)) return 'Lunch';
  if (/snack|bites|fritters|dip|samosa|spring|roll|skew|nugget/i.test(lower)) return 'Snacks';
  return 'Lunch';
}

function buildNutrition(mealName, category, diseaseType) {
  const baseCalories = diseaseType === 'Diabetes'
    ? 180 + (mealName.length % 11) * 15
    : diseaseType === 'Blood Pressure'
      ? 200 + (mealName.length % 9) * 18
      : 220 + (mealName.length % 10) * 16;

  const proteinBase = category === 'Breakfast' ? 12 : category === 'Snacks' ? 8 : 15;
  const carbBase = category === 'Drinks' ? 14 : category === 'Breakfast' ? 24 : 30;
  const fatBase = category === 'Drinks' ? 2 : category === 'Breakfast' ? 8 : 12;
  const fiberBase = category === 'Drinks' ? 1 : category === 'Breakfast' ? 5 : 6;

  const protein = `${Math.max(5, proteinBase + (mealName.length % 5))}g`;
  const carbs = `${Math.max(10, carbBase + (mealName.length % 6))}g`;
  const fat = `${Math.max(2, fatBase + (mealName.length % 4))}g`;
  const fiber = `${Math.max(2, fiberBase + (mealName.length % 4))}g`;

  return {
    calories: `${baseCalories}`,
    protein,
    carbohydrates: carbs,
    carbs,
    fat,
    fiber,
    cookingTime: `${Math.max(10, 15 + (mealName.length % 8))} mins`,
    servings: `${Math.max(1, 2 + (mealName.length % 3))} servings`
  };
}

function classifyRecipe(meal) {
  const mealName = meal.strMeal || 'Recipe';
  const text = `${mealName} ${meal.strInstructions || ''} ${meal.ingredientsText || ''}`.toLowerCase();
  const highSugar = highSugarTerms.some((term) => text.includes(term));
  const highSodium = highSodiumTerms.some((term) => text.includes(term));
  const lowSodium = lowSodiumHints.some((term) => text.includes(term));
  const lowSugar = lowSugarHints.some((term) => text.includes(term));

  if (!highSugar && lowSugar) {
    return 'Diabetes';
  }

  if (!highSodium && lowSodium && !highSugar) {
    return 'Blood Pressure';
  }

  return 'Normal';
}

async function fetchMeals() {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const allMeals = [];
  const seen = new Set();

  for (const letter of letters) {
    const response = await fetch(`${mealDbBase}/search.php?f=${letter}`);
    const data = await response.json();
    const meals = data.meals || [];
    for (const meal of meals) {
      const key = `${meal.idMeal}`;
      if (!seen.has(key)) {
        seen.add(key);
        allMeals.push(meal);
      }
    }
  }

  return allMeals;
}

function mapToRecipe(meal, diseaseType, index) {
  const ingredients = parseIngredients(meal);
  const ingredientsText = ingredients.join(' ');
  const category = getCategory(meal.strMeal, ingredientsText);
  const nutrition = buildNutrition(meal.strMeal, category, diseaseType);

  return {
    id: index,
    title: meal.strMeal,
    name: meal.strMeal,
    disease: diseaseType,
    category,
    image: meal.strMealThumb,
    ingredients,
    procedure: parseInstructions(meal.strInstructions),
    ...nutrition,
    source: 'TheMealDB'
  };
}

async function ensureOutputDir() {
  await mkdir(outputDir, { recursive: true });
}

function serializeRecipeFile(name, recipes) {
  const lines = [
    `const ${name} = ${JSON.stringify(recipes, null, 2)};`,
    '',
    `export default ${name};`,
    ''
  ];
  return lines.join('\n');
}

async function writeRecipesFile(fileName, recipes) {
  const content = serializeRecipeFile(fileName.replace(/\.js$/, ''), recipes);
  await writeFile(path.join(outputDir, fileName), content, 'utf8');
}

async function main() {
  await ensureOutputDir();
  const allMeals = await fetchMeals();
  const diabetic = [];
  const bp = [];
  const normal = [];

  for (const meal of allMeals) {
    const mealName = meal.strMeal || 'Recipe';
    const normalizedMeal = { ...meal, ingredientsText: parseIngredients(meal).join(' ') };
    const designation = classifyRecipe(normalizedMeal);

    if (designation === 'Diabetes' && diabetic.length < 100) {
      diabetic.push(normalizedMeal);
    } else if (designation === 'Blood Pressure' && bp.length < 100) {
      bp.push(normalizedMeal);
    } else if (normal.length < 100) {
      normal.push(normalizedMeal);
    }
  }

  const fillFromPool = (bucket, pool, label) => {
    while (bucket.length < 100 && pool.length) {
      const next = pool.shift();
      if (next) {
        bucket.push(next);
      }
    }
    return bucket;
  };

  const remaining = allMeals.filter((meal) => !diabetic.some((item) => item.idMeal === meal.idMeal) && !bp.some((item) => item.idMeal === meal.idMeal) && !normal.some((item) => item.idMeal === meal.idMeal));
  fillFromPool(diabetic, remaining.filter((meal) => !bp.some((item) => item.idMeal === meal.idMeal) && !normal.some((item) => item.idMeal === meal.idMeal)), 'Diabetes');
  fillFromPool(bp, remaining.filter((meal) => !diabetic.some((item) => item.idMeal === meal.idMeal) && !normal.some((item) => item.idMeal === meal.idMeal)), 'Blood Pressure');
  fillFromPool(normal, remaining.filter((meal) => !diabetic.some((item) => item.idMeal === meal.idMeal) && !bp.some((item) => item.idMeal === meal.idMeal)), 'Normal');

  if (diabetic.length < 100 || bp.length < 100 || normal.length < 100) {
    throw new Error(`Not enough recipes generated: Diabetes=${diabetic.length}, BP=${bp.length}, Normal=${normal.length}`);
  }

  const datasetMap = {
    diabetes: diabetic.slice(0, 100),
    bloodPressure: bp.slice(0, 100),
    normal: normal.slice(0, 100)
  };

  const diabeticRecipes = datasetMap.diabetes.map((meal, index) => mapToRecipe(meal, 'Diabetes', index + 1));
  const bpRecipes = datasetMap.bloodPressure.map((meal, index) => mapToRecipe(meal, 'Blood Pressure', 101 + index));
  const normalRecipes = datasetMap.normal.map((meal, index) => mapToRecipe(meal, 'Normal', 201 + index));

  await writeRecipesFile('diabeticRecipes.js', diabeticRecipes);
  await writeRecipesFile('bpRecipes.js', bpRecipes);
  await writeRecipesFile('normalRecipes.js', normalRecipes);

  const allRecipes = [...diabeticRecipes, ...bpRecipes, ...normalRecipes];
  await writeRecipesFile('localRecipes.js', allRecipes);

  const recipeCatalog = `import diabeticRecipes from './diabeticRecipes';\nimport bpRecipes from './bpRecipes';\nimport normalRecipes from './normalRecipes';\n\nexport const allRecipes = [...diabeticRecipes, ...bpRecipes, ...normalRecipes];\n\nexport function getRecipesByPatientType(patientType) {\n  const normalized = patientType?.toLowerCase() || 'normal';\n\n  if (normalized.includes('diab')) {\n    return diabeticRecipes;\n  }\n\n  if (normalized.includes('blood') || normalized.includes('pressure')) {\n    return bpRecipes;\n  }\n\n  return normalRecipes;\n}\n\nexport default allRecipes;\n`;
  await writeFile(path.join(outputDir, 'recipeCatalog.js'), recipeCatalog, 'utf8');

  console.log(`Generated ${diabeticRecipes.length} diabetic recipes`);
  console.log(`Generated ${bpRecipes.length} blood pressure recipes`);
  console.log(`Generated ${normalRecipes.length} normal recipes`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
