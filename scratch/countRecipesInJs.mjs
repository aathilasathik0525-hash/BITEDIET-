import diabeticRecipes from '../src/data/diabeticRecipes.js';
import bpRecipes from '../src/data/bpRecipes.js';
import normalRecipes from '../src/data/normalRecipes.js';

console.log(`Current Diabetic Recipes: ${diabeticRecipes.length}`);
console.log(`Current BP Recipes: ${bpRecipes.length}`);
console.log(`Current Normal Recipes: ${normalRecipes.length}`);

// Check if any recipe has a name containing a number or placeholder
function checkNames(recipes, category) {
  let count = 0;
  recipes.forEach(r => {
    if (/\d/.test(r.title) || r.title.toLowerCase().includes('recipe') || r.title.toLowerCase().includes('specialty') || r.title.toLowerCase().includes('extra')) {
      console.log(`  [${category}] Number/Placeholder/Suffix found: "${r.title}" (ID: ${r.id})`);
      count++;
    }
  });
  console.log(`  [${category}] Total violations: ${count}`);
}

checkNames(diabeticRecipes, 'Diabetes');
checkNames(bpRecipes, 'BP');
checkNames(normalRecipes, 'Normal');
