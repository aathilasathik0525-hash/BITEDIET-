import diabeticRecipes from '../src/data/diabeticRecipes.js';
import bpRecipes from '../src/data/bpRecipes.js';
import normalRecipes from '../src/data/normalRecipes.js';

function analyze(recipes, category) {
  let noIngr = 0, placeholderIngr = 0;
  let noProc = 0, placeholderProc = 0;
  let noCal = 0, noProt = 0, noCarb = 0, noFat = 0, noFib = 0, noTime = 0, noDiff = 0, noBen = 0;
  
  recipes.forEach(r => {
    if (!r.ingredients || r.ingredients.length === 0) noIngr++;
    else if (r.ingredients.some(i => i.toLowerCase().includes('refer to') || i.toLowerCase().includes('coming soon'))) placeholderIngr++;
    
    const proc = r.procedure || r.instructions;
    if (!proc || proc.length === 0) noProc++;
    else if (proc.some(p => p.toLowerCase().includes('refer to') || p.toLowerCase().includes('coming soon'))) placeholderProc++;
    
    if (!r.calories) noCal++;
    if (!r.protein) noProt++;
    if (!r.carbohydrates && !r.carbs) noCarb++;
    if (!r.fat) noFat++;
    if (!r.fiber) noFib++;
    if (!r.cookingTime && !r.cookTime) noTime++;
    if (!r.difficulty) noDiff++;
    if (!r.healthBenefits) noBen++;
  });
  
  console.log(`=== ${category} (Total: ${recipes.length}) ===`);
  console.log(`  No Ingredients: ${noIngr}, Placeholder Ingredients: ${placeholderIngr}`);
  console.log(`  No Procedure: ${noProc}, Placeholder Procedure: ${placeholderProc}`);
  console.log(`  Missing Calories: ${noCal}`);
  console.log(`  Missing Protein: ${noProt}`);
  console.log(`  Missing Carbs: ${noCarb}`);
  console.log(`  Missing Fat: ${noFat}`);
  console.log(`  Missing Fiber: ${noFib}`);
  console.log(`  Missing Cooking Time: ${noTime}`);
  console.log(`  Missing Difficulty: ${noDiff}`);
  console.log(`  Missing Health Benefits: ${noBen}`);
}

analyze(diabeticRecipes, 'Diabetes');
analyze(bpRecipes, 'BP');
analyze(normalRecipes, 'Normal');
