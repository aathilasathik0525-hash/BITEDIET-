import assert from 'node:assert/strict';
import { getRecipesByPatientType, allRecipes } from '../src/data/recipeCatalog.js';

const diabetic = getRecipesByPatientType('Diabetes');
const bp = getRecipesByPatientType('Blood Pressure');
const normal = getRecipesByPatientType('Normal');

assert.equal(allRecipes.length, 300, 'Expected 300 recipes in the combined catalog');
assert.equal(diabetic.length, 100, 'Expected 100 diabetic recipes');
assert.equal(bp.length, 100, 'Expected 100 blood-pressure recipes');
assert.equal(normal.length, 100, 'Expected 100 normal recipes');

for (const recipe of allRecipes) {
  assert.ok(recipe.id, `Recipe missing id: ${recipe.title || recipe.name}`);
  assert.ok(recipe.title || recipe.name, 'Recipe missing title');
  assert.ok(recipe.image, `Recipe missing image: ${recipe.title || recipe.name}`);
  assert.ok(recipe.mealType, `Recipe missing mealType: ${recipe.title || recipe.name}`);
  assert.ok(Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0, `Recipe missing ingredients: ${recipe.title || recipe.name}`);
  assert.ok(Array.isArray(recipe.instructions) && recipe.instructions.length > 0, `Recipe missing instructions: ${recipe.title || recipe.name}`);
  assert.ok(recipe.calories, `Recipe missing calories: ${recipe.title || recipe.name}`);
  assert.ok(recipe.protein, `Recipe missing protein: ${recipe.title || recipe.name}`);
  assert.ok(recipe.carbohydrates, `Recipe missing carbohydrates: ${recipe.title || recipe.name}`);
  assert.ok(recipe.fat, `Recipe missing fat: ${recipe.title || recipe.name}`);
  assert.ok(recipe.fiber, `Recipe missing fiber: ${recipe.title || recipe.name}`);
  assert.ok(recipe.cookingTime, `Recipe missing cookingTime: ${recipe.title || recipe.name}`);
  assert.ok(recipe.servings, `Recipe missing servings: ${recipe.title || recipe.name}`);
}

console.log('Recipe validation passed.');
