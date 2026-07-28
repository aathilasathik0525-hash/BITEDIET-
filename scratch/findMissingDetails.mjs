import diabeticRecipes from '../src/data/diabeticRecipes.js';
import bpRecipes from '../src/data/bpRecipes.js';
import normalRecipes from '../src/data/normalRecipes.js';

function inspect(recipes, category) {
  let issues = 0;
  recipes.forEach(r => {
    const hasPlaceholderIngr = !r.ingredients || r.ingredients.length === 0 || r.ingredients.some(i => i.toLowerCase().includes('refer to') || i.toLowerCase().includes('coming soon') || !i.trim());
    const hasPlaceholderProc = (!r.procedure || r.procedure.length === 0 || r.procedure.some(p => p.toLowerCase().includes('refer to') || p.toLowerCase().includes('coming soon') || !p.trim())) &&
                               (!r.instructions || r.instructions.length === 0 || r.instructions.some(p => p.toLowerCase().includes('refer to') || p.toLowerCase().includes('coming soon') || !p.trim()));
    const fields = ['calories', 'protein', 'carbohydrates', 'carbs', 'fat', 'fiber', 'cookingTime', 'difficulty', 'healthBenefits'];
    const missingFields = fields.filter(f => !r[f] || String(r[f]).toLowerCase().includes('refer to') || String(r[f]).toLowerCase().includes('coming soon') || !String(r[f]).trim());
    
    if (hasPlaceholderIngr || hasPlaceholderProc || missingFields.length > 0) {
      console.log(`[${category}] Issue in "${r.title}" (ID: ${r.id}):`);
      if (hasPlaceholderIngr) console.log(`  - Ingredients placeholder: ${JSON.stringify(r.ingredients)}`);
      if (hasPlaceholderProc) console.log(`  - Procedure/Instructions placeholder: ${JSON.stringify(r.procedure || r.instructions)}`);
      if (missingFields.length > 0) console.log(`  - Missing/placeholder fields: ${missingFields.join(', ')}`);
      issues++;
    }
  });
  console.log(`[${category}] Total recipes with issues: ${issues} / ${recipes.length}`);
}

inspect(diabeticRecipes, 'Diabetes');
inspect(bpRecipes, 'BP');
inspect(normalRecipes, 'Normal');
